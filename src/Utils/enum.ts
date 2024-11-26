/**
 * Standard Android Intent actions for launching applications and activities.
 * Users can also provide custom action strings if needed.
 *
 * @example
 * ```typescript
 * // Using enum
 * RNLauncherKitHelper.launchApplication('com.android.chrome', {
 *   action: IntentAction.VIEW,
 *   data: 'https://example.com'
 * });
 *
 * // Using custom string
 * RNLauncherKitHelper.launchApplication('com.example.app', {
 *   action: 'android.intent.action.CUSTOM',
 *   data: 'custom://data'
 * });
 * ```
 */
export enum IntentAction {
  /**
   * Start as a main entry point, does not expect data
   * Used for launching an app without any specific data
   */
  MAIN = 'android.intent.action.MAIN',

  /**
   * Display the given data to the user
   * Common for opening URLs, files, or locations
   * @example
   * - Opening URLs in browser
   * - Viewing files
   * - Showing locations on maps
   */
  VIEW = 'android.intent.action.VIEW',

  /**
   * Send data to someone else
   * Used for sharing content between applications
   * @example
   * - Sharing text
   * - Sending files
   * - Sharing URLs
   */
  SEND = 'android.intent.action.SEND'
}

/**
 * Common MIME types for various content types.
 * Users can also provide custom MIME type strings if needed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types}
 *
 * @example
 * ```typescript
 * // Using enum
 * LauncherKitHelper.launchApplication('com.adobe.reader', {
 *   action: IntentAction.VIEW,
 *   data: 'file:///storage/emulated/0/document.pdf',
 *   type: MimeType.PDF
 * });
 *
 * // Using custom MIME type
 * LauncherKitHelper.launchApplication('com.example.app', {
 *   action: IntentAction.VIEW,
 *   data: 'file:///path/to/file',
 *   type: 'application/custom-type'
 * });
 * ```
 */
export enum MimeType {
  /** Wildcard type for any content */
  ALL = '*/*',

  /**
   * MIME type for Sega Genesis/Mega Drive ROM files
   * Used with emulators like MD.emu
   */
  GENESIS_ROM = 'application/x-genesis-rom',

  /**
   * MIME type for PlayStation ROM files
   * Used with emulators like ePSXe
   */
  PSX_ROM = 'application/x-playstation-rom',

  /**
   * MIME type for PDF documents
   * Used with PDF viewers and document handlers
   */
  PDF = 'application/pdf',

  /**
   * MIME type for plain text files
   * Used for raw text content
   */
  TEXT = 'text/plain',

  /**
   * MIME type for HTML documents
   * Used for web content
   */
  HTML = 'text/html'
}
