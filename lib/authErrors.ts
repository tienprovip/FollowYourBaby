// ---------------------------------------------------------------------------
// authErrors.ts
// Maps raw Supabase / network error codes/messages to friendly Vietnamese
// messages that are safe to show in UI (no raw JSON, no technical jargon).
// ---------------------------------------------------------------------------

/**
 * Returns a friendly Vietnamese error message from any thrown value.
 * Never surfaces raw Supabase error objects to the user.
 */
export function mapAuthError(error: unknown): string {
  if (!error) return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';

  // Supabase AuthError shape has a `message` string
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

  const lower = msg.toLowerCase();

  // --- Email / password errors ---
  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.';
  }
  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return 'Tài khoản chưa được xác nhận. Vui lòng kiểm tra hộp thư email của bạn.';
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
  }
  if (lower.includes('password should be at least')) {
    return 'Mật khẩu phải có ít nhất 8 ký tự.';
  }
  if (lower.includes('weak_password') || lower.includes('password is too weak')) {
    return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
  }
  if (lower.includes('signup disabled') || lower.includes('signups_not_allowed')) {
    return 'Đăng ký tài khoản mới tạm thời không khả dụng. Vui lòng thử lại sau.';
  }
  if (lower.includes('user not found')) {
    return 'Không tìm thấy tài khoản với email này.';
  }
  if (lower.includes('for security purposes') || lower.includes('email rate limit')) {
    return 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.';
  }
  if (lower.includes('invalid email') || lower.includes('unable to validate email')) {
    return 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
  }

  // --- Session / token errors ---
  if (lower.includes('token has expired') || lower.includes('refresh_token_not_found')) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  }
  if (lower.includes('session_not_found') || lower.includes('invalid session')) {
    return 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
  }

  // --- OTP errors ---
  if (lower.includes('token is expired') || lower.includes('otp expired')) {
    return 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.';
  }
  if (lower.includes('invalid token') || lower.includes('invalid otp')) {
    return 'Mã xác nhận không đúng. Vui lòng kiểm tra lại.';
  }

  // --- Network errors ---
  if (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror')
  ) {
    return 'Không thể kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
  }
  if (lower.includes('timeout')) {
    return 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.';
  }

  // --- Rate limiting ---
  if (lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Bạn đã thực hiện quá nhiều thao tác. Vui lòng đợi một lúc rồi thử lại.';
  }

  // --- Generic fallback ---
  return 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
}
