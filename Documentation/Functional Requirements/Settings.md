# FR10: User Preferences and Configuration  
*The system shall provide centralized controls for user customization, account management, and application behavior.*

---

## FR10.1: User Profile & Account Settings  
### FR10.1.1: Profile Information  
- Shall store/edit:  
  - Name  
  - Email  
  - Preferred username (validated per RFC 5322)  
- Shall enforce unique usernames (case-insensitive)  

### FR10.1.2: Account Management  
- Shall allow password changes (with current password verification)  
- Shall provide 7-day grace period for account deletion (reversible)  

### FR10.1.3: Role Management  
- Shall display current role (e.g., "Linguist")  
- Shall show role-specific feature toggles  

### FR10.1.4: Contribution History  
- Shall display:  
  - Approved/rejected submissions  
  - Monthly contribution graphs  
  - Peer review ratings (if applicable)  

---

## FR10.2: Language & Localization  
### FR10.2.1: Interface Language  
- Shall support all 12 official SA languages  
- Shall auto-adjust RTL/LTR layout  

### FR10.2.2: Working Languages  
- Shall allow 1-3 primary language selections  
- Shall prioritize these languages in searches  

### FR10.2.3: Regional Variants  
- Shall offer dialect selections (e.g., Zulu-KZN vs Zulu-Gauteng)  

---

## FR10.3: Appearance & Accessibility  
### FR10.3.1: Theme Engine  
- Shall support:  
  - Light/dark/system themes  
  - Custom HEX color inputs  

### FR10.3.2: Text Accessibility  
- Shall provide:  
  - Font scaling (100%-200%)  
  - 3+ Unicode-compliant fonts  

### FR10.3.3: TTS Integration  
- Shall allow voice speed/pitch adjustment (50%-150% range)  

---

## FR10.4: Search & Data  
### FR10.4.1: Search Behavior  
- Shall remember last-used mode (exact/fuzzy/AI)  

### FR10.4.2: Result Display  
- Shall paginate results (10/25/50 per page)  

### FR10.4.3: Index Management  
- Shall allow lexicon prioritization (drag-and-drop UI)  

---

## FR10.5: Offline & Sync  
### FR10.5.1: Storage Controls  
- Shall warn at 90% storage capacity  

### FR10.5.2: Sync Scheduling  
- Shall offer:  
  - Background sync intervals (15/30/60 min)  
  - Wi-Fi-only toggle  

---

## FR10.6: Notifications  
### FR10.6.1: Granular Toggles  
- Shall allow per-channel controls (in-app/email/push)  

### FR10.6.2: Digest Modes  
- Shall support daily/weekly summaries  

---

## FR10.7: Privacy & Security  
### FR10.7.1: Data Export  
- Shall generate GDPR-compliant ZIP archives  

### FR10.7.2: 2FA Enforcement  
- Shall require 2FA for Administrators  

---

## FR10.8: Advanced Features  
### FR10.8.1: API Key Rotation  
- Shall auto-expire keys after 90 days  

### FR10.8.2: AR/VR Toggles  
- Shall disable AR on unsupported devices  

