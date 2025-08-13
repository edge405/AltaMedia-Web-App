# Company User Login System - Complete Guide

## Overview

The Alta Media platform uses a **unified user system** where all users (company owners, team members, and admins) log in through the same authentication system, but have different access levels based on their roles and company memberships.

## How Company Users Login

### 1. **Unified Login System**
All users log in using the same system:
- **Email** + **Password** from the `users` table
- System checks their role and company memberships
- Access is granted based on permissions

### 2. **User Types & Access Levels**

#### **Company Owner**
- Creates the company
- Has full access to their company
- Can invite team members
- Can manage all company data

#### **Company Admin**
- Invited by company owner
- Can manage team members
- Can edit company data
- Cannot delete the company

#### **Company Member**
- Invited by owner/admin
- Limited access based on permissions
- Can view and contribute to company data

#### **Platform Admin**
- System-wide access
- Can view all companies and brand kits
- Can download brand kit data

## Complete User Journey

### **Step 1: Company Owner Registration**
```sql
-- 1. User registers
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('owner@company.com', 'hashed_password', 'John Doe', 'user');

-- 2. User creates company
INSERT INTO companies (user_id, name, industry, phone_number, email_address)
VALUES (user_id, 'My Company', 'Technology', '+1234567890', 'contact@company.com');

-- 3. User is automatically added as company owner
INSERT INTO company_users (company_id, user_id, role)
VALUES (company_id, user_id, 'owner');
```

### **Step 2: Inviting Team Members**
```sql
-- 1. Owner sends invitation
INSERT INTO user_invitations (
    company_id, 
    invited_by_user_id, 
    email, 
    full_name, 
    role, 
    invitation_token, 
    expires_at
) VALUES (
    company_id,
    owner_user_id,
    'member@company.com',
    'Jane Smith',
    'member',
    'unique_token_here',
    NOW() + INTERVAL '7 days'
);
```

### **Step 3: Team Member Registration/Acceptance**

#### **Option A: New User (No Account)**
1. **Receives invitation email** with unique token
2. **Clicks invitation link** → `/invite/accept?token=unique_token_here`
3. **Creates account** with email and password
4. **Automatically joins company** with specified role

```sql
-- 1. User creates account
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('member@company.com', 'hashed_password', 'Jane Smith', 'user');

-- 2. User accepts invitation
UPDATE user_invitations 
SET status = 'accepted', accepted_at = NOW(), accepted_user_id = new_user_id
WHERE invitation_token = 'unique_token_here';

-- 3. User is added to company
INSERT INTO company_users (company_id, user_id, role, invitation_id)
VALUES (company_id, new_user_id, 'member', invitation_id);
```

#### **Option B: Existing User (Has Account)**
1. **Receives invitation email** with unique token
2. **Clicks invitation link** → `/invite/accept?token=unique_token_here`
3. **Logs in** with existing credentials
4. **Automatically joins company** with specified role

```sql
-- 1. User accepts invitation (already has account)
UPDATE user_invitations 
SET status = 'accepted', accepted_at = NOW(), accepted_user_id = existing_user_id
WHERE invitation_token = 'unique_token_here';

-- 2. User is added to company
INSERT INTO company_users (company_id, user_id, role, invitation_id)
VALUES (company_id, existing_user_id, 'member', invitation_id);
```

### **Step 4: Login Process**

#### **Authentication Flow**
```javascript
// 1. User submits login form
POST /api/auth/login
{
  "email": "member@company.com",
  "password": "password123"
}

// 2. Server validates credentials
SELECT * FROM users WHERE email = 'member@company.com' AND is_active = true;

// 3. Server checks company access
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    c.id as company_id,
    c.name as company_name,
    cu.role as company_role
FROM users u
JOIN company_users cu ON u.id = cu.user_id
JOIN companies c ON cu.company_id = c.id
WHERE u.email = 'member@company.com' AND cu.is_active = true;

// 4. Server returns user data with company access
{
  "user": {
    "id": "user_uuid",
    "email": "member@company.com",
    "full_name": "Jane Smith",
    "role": "user"
  },
  "companies": [
    {
      "id": "company_uuid",
      "name": "My Company",
      "role": "member"
    }
  ],
  "token": "jwt_token_here"
}
```

## Backend API Endpoints

### **Authentication Endpoints**
```javascript
// User registration
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}

// User login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Logout
POST /api/auth/logout
```

### **Invitation Endpoints**
```javascript
// Send invitation
POST /api/companies/:companyId/invitations
{
  "email": "member@company.com",
  "full_name": "Jane Smith",
  "role": "member"
}

// Accept invitation
POST /api/invitations/:token/accept
{
  "password": "password123" // Only for new users
}

// Get pending invitations
GET /api/invitations/pending
```

### **Company Access Endpoints**
```javascript
// Get user's companies
GET /api/user/companies

// Get company members
GET /api/companies/:companyId/members

// Update member role
PUT /api/companies/:companyId/members/:userId
{
  "role": "admin"
}

// Remove member
DELETE /api/companies/:companyId/members/:userId
```

## Frontend Implementation

### **Login Component**
```jsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Redirect based on user type
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.companies.length > 0) {
          navigate('/company-selection');
        } else {
          navigate('/company-setup');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### **Invitation Acceptance Component**
```jsx
const InvitationAccept = () => {
  const { token } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Fetch invitation details
    fetchInvitation(token);
  }, [token]);

  const handleAcceptInvitation = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/invitations/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to login or company dashboard
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  return (
    <div>
      <h2>Join {invitation?.company_name}</h2>
      <p>You've been invited as a {invitation?.role}</p>
      
      {isNewUser && (
        <form onSubmit={handleAcceptInvitation}>
          <input
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
          <button type="submit">Create Account & Join</button>
        </form>
      )}
      
      {!isNewUser && (
        <div>
          <p>You already have an account. Please log in to accept this invitation.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}
    </div>
  );
};
```

## Security Considerations

### **1. Token Security**
- Invitation tokens should be cryptographically secure
- Tokens should expire (7-14 days recommended)
- Tokens should be single-use

### **2. Role-Based Access Control**
```javascript
// Middleware to check company access
const checkCompanyAccess = (req, res, next) => {
  const { companyId } = req.params;
  const userId = req.user.id;
  
  const access = await db.query(`
    SELECT role FROM company_users 
    WHERE company_id = $1 AND user_id = $2 AND is_active = true
  `, [companyId, userId]);
  
  if (!access.rows.length) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  req.userCompanyRole = access.rows[0].role;
  next();
};
```

### **3. Data Validation**
- Validate email format
- Check password strength
- Sanitize user inputs
- Prevent SQL injection

## Database Queries for Common Operations

### **Get User's Company Access**
```sql
SELECT 
    c.id as company_id,
    c.name as company_name,
    cu.role as company_role,
    cu.joined_at
FROM users u
JOIN company_users cu ON u.id = cu.user_id
JOIN companies c ON cu.company_id = c.id
WHERE u.id = $1 AND cu.is_active = true;
```

### **Check User Permissions**
```sql
SELECT 
    cu.role,
    c.user_id as owner_id
FROM company_users cu
JOIN companies c ON cu.company_id = c.id
WHERE cu.company_id = $1 AND cu.user_id = $2 AND cu.is_active = true;
```

### **Get Company Members**
```sql
SELECT 
    u.id,
    u.email,
    u.full_name,
    cu.role,
    cu.joined_at,
    cu.is_active
FROM company_users cu
JOIN users u ON cu.user_id = u.id
WHERE cu.company_id = $1
ORDER BY cu.joined_at DESC;
```

## Summary

The company user login system works as follows:

1. **All users have accounts** in the `users` table
2. **Company access is managed** through the `company_users` table
3. **Invitations are sent** via the `user_invitations` table
4. **Users log in once** and access all their companies
5. **Role-based permissions** control what users can do
6. **Secure token system** handles invitations

This unified approach provides:
- ✅ Simple login process
- ✅ Secure access control
- ✅ Easy team management
- ✅ Scalable architecture
- ✅ Clear audit trail
