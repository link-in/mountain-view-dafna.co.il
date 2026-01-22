# Beds24 Webhook - Property Mapping Setup

This guide explains how to configure the Beds24 webhook to include propertyId, so each property owner receives notifications for their own bookings.

## 📋 Overview

The system automatically identifies which property owner should receive WhatsApp notifications by matching the `propertyId` from the Beds24 webhook with the user's property in the database.

## 🚀 Setup Instructions

### Step 1: Configure Webhook in Beds24

When setting up your Beds24 webhook, make sure to include the `propertyId` field in the JSON payload.

#### JSON Template:

```json
{
  "guestName": "[GUESTFIRSTNAME] [GUESTNAME]",
  "phone": "[GUESTMOBILE]",
  "checkInDate": "[ARRIVAL]",
  "checkOutDate": "[DEPARTURE]",
  "bookingId": "[BOOKID]",
  "roomName": "[UNITNAME]",
  "propertyId": "[PROPID]",
  "roomId": "[UNITID]",
  "numGuests": "[NUMADULT]",
  "numChildren": "[NUMCHILD]",
  "totalPrice": "[PRICE]",
  "email": "[GUESTEMAIL]"
}
```

**Key Fields:**
- `propertyId`: `[PROPID]` - Property ID from Beds24
- `roomId`: `[UNITID]` - Room/Unit ID from Beds24

### Step 2: Set Phone Number in Dashboard

Each user needs to set their WhatsApp number in their profile:

1. Login to dashboard
2. Go to **איזור אישי** (Profile)
3. Click **ערוך** (Edit)
4. Enter phone number in format: `+972501234567`
5. Click **שמור** (Save)

### Step 3: How It Works

When a booking arrives:

1. Beds24 sends webhook with `propertyId` or `roomId`
2. System finds the user with matching property/room
3. System sends WhatsApp to:
   - **Guest**: Booking confirmation
   - **Owner**: New booking notification (using phone from profile)

## 🔄 Fallback Methods

The system tries multiple methods to find the owner's phone:

### Method 1: User Profile (Primary)
- Matches `propertyId` from webhook with user's `propertyId`
- Or matches `roomId` from webhook with user's `roomId`
- Uses phone number from user profile

### Method 2: Environment Variable (Fallback)
- If no match found, uses `OWNER_PHONE_NUMBER` from `.env.local`
- Useful for single-property setups

### Method 3: No Notification
- If neither method works, guest still gets confirmation
- Owner notification is skipped (logged in console)

## 📱 Testing

### Test with Postman:

```json
POST http://localhost:3000/api/webhook

{
  "guestName": "יוסי כהן",
  "phone": "+972507654321",
  "checkInDate": "2026-02-15",
  "checkOutDate": "2026-02-20",
  "propertyId": "306559",
  "roomId": "638851",
  "roomName": "Mountain Suite",
  "bookingId": "BK-12345"
}
```

**Expected Result:**
- Guest receives confirmation WhatsApp
- Owner (matching propertyId 306559) receives notification WhatsApp

## 🏢 Multi-Property Support

This setup supports multiple properties automatically:

### Example Setup:

**User 1:**
- Property ID: `306559`
- Phone: `+972501111111`
- Receives notifications for bookings with `propertyId: "306559"`

**User 2:**
- Property ID: `123456`
- Phone: `+972502222222`
- Receives notifications for bookings with `propertyId: "123456"`

**User 3:**
- Property ID: `111111`
- Phone: `+972503333333`
- Receives notifications for bookings with `propertyId: "111111"`

## 🔍 Verification

### Check User Configuration:

Look at `src/data/users.json`:

```json
[
  {
    "id": "user_1",
    "email": "owner1@example.com",
    "displayName": "נוף הרים בדפנה",
    "propertyId": "306559",
    "roomId": "638851",
    "phoneNumber": "+972501234567"
  }
]
```

### Check Console Logs:

When webhook arrives, you'll see:

```
📥 Received Beds24 Webhook:
Property ID: 306559
✅ Found owner phone for property 306559: +972501234567
✅ Owner notification sent successfully
```

Or if no match:

```
⚠️  No phone number found for property/room: { propertyId: '999999', roomId: '888888' }
```

## 🐛 Troubleshooting

### Owner not receiving notifications?

1. **Check Property ID Match:**
   ```
   Webhook propertyId: "306559"
   User propertyId: "306559"
   ✅ Must match exactly
   ```

2. **Check Phone Number Format:**
   - Must include country code: `+972501234567`
   - No spaces or dashes
   - Set in user profile (dashboard)

3. **Check Console Logs:**
   - Look for "Found owner phone for property..."
   - Or "No phone number found for property..."

4. **Verify User Data:**
   - Check `src/data/users.json`
   - Ensure `phoneNumber` field exists and has value
   - Ensure `propertyId` matches Beds24

### Multiple owners getting notifications?

- Each property ID should be unique to one user
- Check `users.json` for duplicate propertyIds

### Guest gets message but owner doesn't?

- System prioritizes guest messages
- Owner notification failure doesn't affect guest
- Check console for owner notification errors

## 💡 Best Practices

1. **Use Property ID**: More reliable than room ID for multi-unit properties
2. **Test First**: Send test webhook to verify routing
3. **Monitor Logs**: Check console for owner match status
4. **Update Profiles**: Ensure all users set their phone numbers
5. **Validate Format**: Use international format for phone numbers

## 🎯 Next Steps

1. Configure Beds24 webhook with `propertyId`
2. Each owner sets phone in dashboard profile
3. Test with sample booking
4. Monitor first real booking
5. Enjoy automatic notifications! 🎉

## 📞 Support

If owner notifications aren't working:
1. Check console logs for matching errors
2. Verify propertyId in webhook payload
3. Confirm phone number in user profile
4. Test with Postman first
