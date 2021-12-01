/*
 * Copyright (c) Estonian Information System Authority
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import config from "./config";

import ErrorCode from "./errors/ErrorCode";

import Action from "./models/Action";
import AuthenticateOptions from "./models/AuthenticateOptions";
import SignOptions from "./models/SignOptions";
import Versions from "./models/Versions";
import ResponseAuthenticateSuccess from "./models/ResponseAuthenticateSuccess";
import ResponseStatusSuccess from "./models/ResponseStatusSuccess";

import WebExtensionService from "./services/WebExtensionService";

import HttpResponse from "./models/HttpResponse";
import ResponseSignSuccess from "./models/ResponseSignSuccess";
import VersionMismatchError from "./errors/VersionMismatchError";
import MissingParameterError from "./errors/MissingParameterError";
import * as version from "./utils/version";
import sleep from "./utils/sleep";

const webExtensionService = new WebExtensionService();
const initializationTime  = +new Date();

/**
 * Give browsers a moment to load the content script
 */
async function extensionLoadDelay(): Promise<void> {
  const now = +new Date();
  await sleep(initializationTime + config.MAX_EXTENSION_LOAD_DELAY - now);
}

export async function status(): Promise<Versions> {
  await extensionLoadDelay();

  let statusResponse;

  const library = config.VERSION;

  const timeout = config.EXTENSION_HANDSHAKE_TIMEOUT + config.NATIVE_APP_HANDSHAKE_TIMEOUT;
  const message = {
    action:         Action.STATUS,
    libraryVersion: config.VERSION,
  };

  try {
    statusResponse = await webExtensionService.send<ResponseStatusSuccess>(message, timeout);
  } catch (error: any) {
    error.library = library;

    throw error;
  }

  const status: Versions = {
    library,
    ...statusResponse,
  };

  const requiresUpdate = version.checkCompatibility(status);

  if (requiresUpdate.extension || requiresUpdate.nativeApp) {
    throw new VersionMismatchError(undefined, status, requiresUpdate);
  }

  return status;
}

export async function authenticate(options: AuthenticateOptions): Promise<HttpResponse> {
  await extensionLoadDelay();

  if (typeof options != "object") {
    throw new MissingParameterError("authenticate function requires an options object as parameter");
  }

  if (!options.getAuthChallengeUrl) {
    throw new MissingParameterError("getAuthChallengeUrl missing from authenticate options");
  }

  if (!options.postAuthTokenUrl) {
    throw new MissingParameterError("postAuthTokenUrl missing from authenticate options");
  }

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options.serverRequestTimeout || config.DEFAULT_SERVER_REQUEST_TIMEOUT) * 2 +
    (options.userInteractionTimeout || config.DEFAULT_USER_INTERACTION_TIMEOUT)
  );

  const message = {
    ...options,

    action:         Action.AUTHENTICATE,
    libraryVersion: config.VERSION,
  };

  const result = await webExtensionService.send<ResponseAuthenticateSuccess>(message, timeout);

  return result.response;
}

export async function sign(options: SignOptions): Promise<HttpResponse> {
  await extensionLoadDelay();

  if (typeof options != "object") {
    throw new MissingParameterError("sign function requires an options object as parameter");
  }

  if (!options.postPrepareSigningUrl) {
    throw new MissingParameterError("postPrepareSigningUrl missing from sign options");
  }

  if (!options.postFinalizeSigningUrl) {
    throw new MissingParameterError("postFinalizeSigningUrl missing from sign options");
  }

  const timeout = (
    config.EXTENSION_HANDSHAKE_TIMEOUT +
    config.NATIVE_APP_HANDSHAKE_TIMEOUT +
    (options.serverRequestTimeout || config.DEFAULT_SERVER_REQUEST_TIMEOUT) * 2 +
    (options.userInteractionTimeout || config.DEFAULT_USER_INTERACTION_TIMEOUT) * 2
  );

  const message = {
    ...options,

    action:         Action.SIGN,
    libraryVersion: config.VERSION,
  };

  const result = await webExtensionService.send<ResponseSignSuccess>(message, timeout);

  return result.response;
}

export { Action, ErrorCode };
export { hasVersionProperties } from "./utils/version";
export { config };
