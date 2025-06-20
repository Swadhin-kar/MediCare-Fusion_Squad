var tabs = document.querySelectorAll('.tab-header button');
var tabPanels = document.querySelectorAll('[role="tabpanel"]');
tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        // Deselect all tabs
        tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        // Hide all panels
        tabPanels.forEach(function (panel) {
            panel.hidden = true;
        });
        // Activate selected tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        // Show corresponding panel
        var panelId = tab.getAttribute('aria-controls');
        if (panelId) {
            var panel = document.getElementById(panelId);
            if (panel) {
                panel.hidden = false;
                var input = panel.querySelector('input');
                if (input)
                    input.focus();
                resetFormsVisibility(panelId);
            }
        }
    });
});
// Toggle login/register forms inside each role tab
document.querySelectorAll('.form-toggle-text span').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
        var target = toggle.getAttribute('data-target');
        var container = toggle.closest('.tab-content');
        if (target && container) {
            var loginForm = container.querySelector('form[id$="login-form"]');
            var registerForm = container.querySelector('form[id$="register-form"]');
            if (target.includes('register')) {
                if (loginForm)
                    loginForm.style.display = 'none';
                if (registerForm)
                    registerForm.style.display = 'flex';
            }
            else if (target.includes('login')) {
                if (loginForm)
                    loginForm.style.display = 'flex';
                if (registerForm)
                    registerForm.style.display = 'none';
            }
        }
    });
});
// Helper to reset forms to default login view on tab switch
function resetFormsVisibility(tabId) {
    var panel = document.getElementById(tabId);
    if (!panel)
        return;
    var loginForms = panel.querySelectorAll('form[id$="login-form"]');
    var registerForms = panel.querySelectorAll('form[id$="register-form"]');
    loginForms.forEach(function (form) {
        form.style.display = 'flex';
    });
    registerForms.forEach(function (form) {
        form.style.display = 'none';
    });
}
// Initialize focus on first tab
var firstTab = document.getElementById('tab-patient-btn');
firstTab === null || firstTab === void 0 ? void 0 : firstTab.focus();
