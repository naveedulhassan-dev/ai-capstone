/* ==========================================================================
   Settings form — validation & interaction logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Element references -------------------------------------------------
  const form = document.getElementById('settingsForm');
  const banner = document.getElementById('formBanner');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');

  const fullNameInput = document.getElementById('fullName');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const strengthMeter = document.getElementById('strengthMeter');
  const strengthLabel = document.getElementById('strengthLabel');
  const requirementItems = document.querySelectorAll('#pwRequirements li');

  const bioInput = document.getElementById('bio');
  const bioCount = document.getElementById('bioCount');

  const profilePictureInput = document.getElementById('profilePicture');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarInitial = document.getElementById('avatarInitial');
  const avatarImg = document.getElementById('avatarImg');

  const MAX_BIO_LENGTH = 200;
  const MAX_USERNAME_LENGTH = 20;
  const MAX_IMAGE_SIZE_MB = 2;
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  // ==========================================================================
  // Generic error helpers
  // ==========================================================================

  /**
   * Displays an error message under a field and marks the field invalid.
   */
  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById('err-' + fieldId);
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  /**
   * Clears an error message and invalid state for a field.
   */
  function clearError(fieldId, markValid) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById('err-' + fieldId);
    if (input) {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      if (markValid) {
        input.classList.add('is-valid');
      }
    }
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /**
   * Shows the global success banner.
   */
  function showSuccess(message) {
    banner.hidden = false;
    banner.className = 'banner success';
    banner.textContent = message;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Shows the global error banner.
   */
  function showBannerError(message) {
    banner.hidden = false;
    banner.className = 'banner error';
    banner.textContent = message;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideBanner() {
    banner.hidden = true;
  }

  // ==========================================================================
  // Field-level validators
  // ==========================================================================

  function validateFullName() {
    const value = fullNameInput.value.trim();
    if (value.length === 0) {
      showError('fullName', 'Full name is required.');
      return false;
    }
    clearError('fullName', true);
    return true;
  }

  function validateUsername() {
    const value = usernameInput.value.trim();
    if (value.length === 0) {
      showError('username', 'Username is required.');
      return false;
    }
    if (value.length > MAX_USERNAME_LENGTH) {
      showError('username', `Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`);
      return false;
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
      showError('username', 'Only letters, numbers, underscores and dots are allowed.');
      return false;
    }
    clearError('username', true);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length === 0) {
      showError('email', 'Email address is required.');
      return false;
    }
    if (!emailPattern.test(value)) {
      showError('email', 'Enter a valid email address.');
      return false;
    }
    clearError('email', true);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    // Accepts digits, spaces, dashes, parentheses and an optional leading +.
    const phonePattern = /^\+?[0-9\s().-]{7,20}$/;
    if (value.length === 0) {
      showError('phone', 'Phone number is required.');
      return false;
    }
    const digitCount = value.replace(/\D/g, '').length;
    if (!phonePattern.test(value) || digitCount < 7 || digitCount > 15) {
      showError('phone', 'Enter a valid phone number.');
      return false;
    }
    clearError('phone', true);
    return true;
  }

  function validateCurrentPassword() {
    const value = currentPasswordInput.value;
    if (value.length === 0) {
      showError('currentPassword', 'Current password is required.');
      return false;
    }
    clearError('currentPassword', true);
    return true;
  }

  /**
   * Checks a password against the security rules and returns a
   * results object describing which rules pass.
   */
  function getPasswordRuleResults(value) {
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };
  }

  function validatePassword() {
    const value = newPasswordInput.value;
    const rules = getPasswordRuleResults(value);
    const allPass = Object.values(rules).every(Boolean);

    if (value.length === 0) {
      showError('newPassword', 'New password is required.');
      return false;
    }
    if (!allPass) {
      showError('newPassword', 'Password does not meet all requirements below.');
      return false;
    }
    clearError('newPassword', true);
    return true;
  }

  function validateConfirmPassword() {
    const value = confirmPasswordInput.value;
    if (value.length === 0) {
      showError('confirmPassword', 'Please confirm your new password.');
      return false;
    }
    if (value !== newPasswordInput.value) {
      showError('confirmPassword', 'Passwords do not match.');
      return false;
    }
    clearError('confirmPassword', true);
    return true;
  }

  function validateBio() {
    const value = bioInput.value;
    if (value.length > MAX_BIO_LENGTH) {
      showError('bio', `Bio must be ${MAX_BIO_LENGTH} characters or fewer.`);
      return false;
    }
    clearError('bio', false);
    return true;
  }

  function validateProfilePicture() {
    const files = profilePictureInput.files;
    if (!files || files.length === 0) {
      clearError('profilePicture', false);
      return true; // optional field
    }
    const file = files[0];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showError('profilePicture', 'Only JPG and PNG images are allowed.');
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      showError('profilePicture', `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return false;
    }
    clearError('profilePicture', false);
    return true;
  }

  /**
   * Runs every field validator and returns true only if all pass.
   */
  function validateForm() {
    const results = [
      validateFullName(),
      validateUsername(),
      validateEmail(),
      validatePhone(),
      validateCurrentPassword(),
      validatePassword(),
      validateConfirmPassword(),
      validateBio(),
      validateProfilePicture(),
    ];
    return results.every(Boolean);
  }

  // ==========================================================================
  // Password strength meter
  // ==========================================================================

  function updatePasswordStrength() {
    const value = newPasswordInput.value;
    const rules = getPasswordRuleResults(value);
    const passCount = Object.values(rules).filter(Boolean).length;

    requirementItems.forEach((item) => {
      const rule = item.getAttribute('data-rule');
      item.classList.toggle('is-met', !!rules[rule]);
    });

    strengthMeter.className = 'strength-meter';
    let label = 'Password strength: —';

    if (value.length > 0) {
      let level = 1;
      if (passCount >= 5) level = 4;
      else if (passCount >= 4) level = 3;
      else if (passCount >= 2) level = 2;

      strengthMeter.classList.add('level-' + level);

      const labels = { 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
      label = 'Password strength: ' + labels[level];
    }

    strengthLabel.textContent = label;
  }

  // ==========================================================================
  // Password visibility toggles
  // ==========================================================================

  document.querySelectorAll('.toggle-visibility').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';

      input.type = isPassword ? 'text' : 'password';
      btn.classList.toggle('is-showing', isPassword);
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // ==========================================================================
  // Bio character counter
  // ==========================================================================

  function updateBioCount() {
    const length = bioInput.value.length;
    bioCount.textContent = `${length} / ${MAX_BIO_LENGTH}`;
    bioCount.style.color = length > MAX_BIO_LENGTH
      ? 'var(--color-danger)'
      : 'var(--color-ink-faint)';
  }

  // ==========================================================================
  // Avatar preview
  // ==========================================================================

  function updateAvatarPreview() {
    const files = profilePictureInput.files;
    if (!files || files.length === 0) {
      avatarImg.hidden = true;
      avatarInitial.hidden = false;
      return;
    }
    const file = files[0];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return; // validateProfilePicture() already surfaces the error
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarImg.src = event.target.result;
      avatarImg.hidden = false;
      avatarInitial.hidden = true;
    };
    reader.readAsDataURL(file);
  }

  // ==========================================================================
  // Sidebar active-section tracking
  // ==========================================================================

  const sections = document.querySelectorAll('.card[id]');
  const sideLinks = document.querySelectorAll('.side-link');

  function setActiveSection(id) {
    sideLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.section === id);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ==========================================================================
  // Real-time validation event listeners
  // ==========================================================================

  fullNameInput.addEventListener('input', validateFullName);
  usernameInput.addEventListener('input', validateUsername);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);

  currentPasswordInput.addEventListener('input', validateCurrentPassword);

  newPasswordInput.addEventListener('input', () => {
    updatePasswordStrength();
    validatePassword();
    // Re-check confirm password whenever the new password changes.
    if (confirmPasswordInput.value.length > 0) {
      validateConfirmPassword();
    }
  });

  confirmPasswordInput.addEventListener('input', validateConfirmPassword);

  bioInput.addEventListener('input', () => {
    updateBioCount();
    validateBio();
  });

  profilePictureInput.addEventListener('change', () => {
    validateProfilePicture();
    updateAvatarPreview();
  });

  // ==========================================================================
  // Form submission
  // ==========================================================================

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideBanner();

    const isValid = validateForm();

    if (!isValid) {
      showBannerError('Please fix the highlighted fields and try again.');
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate a save operation with a brief loading state.
    saveBtn.disabled = true;
    saveBtn.classList.add('is-loading');

    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.classList.remove('is-loading');
      showSuccess('Settings saved successfully.');
    }, 900);
  });

  // ==========================================================================
  // Reset handling
  // ==========================================================================

  resetBtn.addEventListener('click', () => {
    // Runs after the native form reset has cleared field values.
    setTimeout(() => {
      hideBanner();

      const fieldIds = [
        'fullName', 'username', 'email', 'phone',
        'currentPassword', 'newPassword', 'confirmPassword',
        'bio', 'profilePicture',
      ];
      fieldIds.forEach((id) => clearError(id, false));

      strengthMeter.className = 'strength-meter';
      strengthLabel.textContent = 'Password strength: —';
      requirementItems.forEach((item) => item.classList.remove('is-met'));

      updateBioCount();
      updateAvatarPreview();
    }, 0);
  });

  // ==========================================================================
  // Initial state
  // ==========================================================================

  updateBioCount();
});
