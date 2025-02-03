/*
 * Copyright (c) 2025-2025 Estonian Information System Authority
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

import ActionPendingError from "./ActionPendingError";
import ActionTimeoutError from "./ActionTimeoutError";
import ContextInsecureError from "./ContextInsecureError";
import ExtensionUnavailableError from "./ExtensionUnavailableError";
import MissingParameterError from "./MissingParameterError";
import NativeFatalError from "./NativeFatalError";
import NativeInvalidArgumentError from "./NativeInvalidArgumentError";
import NativeUnavailableError from "./NativeUnavailableError";
import UnknownError from "./UnknownError";
import UserCancelledError from "./UserCancelledError";
import UserTimeoutError from "./UserTimeoutError";
import VersionInvalidError from "./VersionInvalidError";
import VersionMismatchError from "./VersionMismatchError";

type KnownErrorConstructors
  = typeof ActionPendingError
  | typeof ActionTimeoutError
  | typeof ContextInsecureError
  | typeof ExtensionUnavailableError
  | typeof MissingParameterError
  | typeof NativeInvalidArgumentError
  | typeof NativeFatalError
  | typeof NativeUnavailableError
  | typeof UserCancelledError
  | typeof UserTimeoutError
  | typeof VersionInvalidError
  | typeof VersionMismatchError
  | typeof UnknownError;

export default KnownErrorConstructors;