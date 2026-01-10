/**
 * Standard HTTP-related constants.
 */
export const HttpStatus = {
	OK: 200,
	Created: 201,
	NoContent: 204,
	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	Conflict: 409,
	InternalServerError: 500
} as const;

/**
 * Default pagination settings used by list views and APIs.
 */
export const Pagination = {
	DefaultPage: 1,
	DefaultPageSize: 20,
	MaxPageSize: 100
} as const;

/**
 * Date/time display and parsing formats used in the UI.
 * Keep formats consumable by Angular DatePipe or by date libraries you use.
 */
export const DateFormats = {
	ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'",
	DisplayDate: 'MMM d, y',
	DisplayDateTime: 'MMM d, y, h:mm a'
} as const;

/**
 * Keys on localStorage
 */
export const StorageKyes = {
	UserLanguage: 'user_lang'
} as const;
