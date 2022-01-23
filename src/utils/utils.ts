export function xss(str: string): string {
    return str.replace(/&/g, '&amp;').
                replace(/</g, '&lt;').
                replace(/"/g, '&quot;').
                replace(/'/g, '&#039;')
}