# Reviews System Testing Guide

## ✅ System Verification Checklist

### 1. Database Setup

Check if the migration ran successfully:

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'reviews';

-- Should return: reviews

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reviews';
```

### 2. API Endpoints Testing

#### Test Public Reviews Endpoint

```bash
# Test in terminal or browser
curl http://localhost:3000/api/reviews

# Expected: JSON array (may be empty initially)
# Example response:
# []
# or
# [{"id":"booking_123","userName":"John","rating":5,...}]
```

#### Test Admin Sync Endpoint (Requires Login)

1. Login to admin dashboard
2. Open browser DevTools → Network tab
3. Visit `/admin/reviews`
4. Click "סנכרן ביקורות" button
5. Check Network tab for POST to `/api/admin/reviews/sync`
6. Should return `{"success": true, "stats": {...}}`

### 3. Frontend Display Testing

#### ReviewsCarousel Component

1. Visit homepage: `http://localhost:3000`
2. Scroll to reviews section
3. Verify:
   - [ ] Reviews carousel is visible
   - [ ] Reviews display with proper styling
   - [ ] Star ratings show correctly
   - [ ] User avatars load
   - [ ] Source logos (Booking/Airbnb/Google) display
   - [ ] Scroll buttons work (desktop)
   - [ ] Touch scrolling works (mobile)
   - [ ] Loading state handled gracefully
   - [ ] Fallback to static reviews if API fails

#### Admin Dashboard

1. Login with admin credentials
2. Navigate to `/admin/reviews`
3. Verify:
   - [ ] Statistics cards show numbers
   - [ ] "By Source" breakdown displays
   - [ ] Sync button is functional
   - [ ] Last sync time displays
   - [ ] Sync results table appears after sync

### 4. Data Flow Testing

#### Full Sync Flow

1. Ensure `.env.local` has BEDS24 credentials
2. Login to admin dashboard
3. Navigate to `/admin/reviews`
4. Click "סנכרן ביקורות"
5. Wait for completion (may take 10-30 seconds)
6. Check results:
   ```
   Booking.com: X fetched, Y saved
   Airbnb: X fetched, Y saved
   Google: X fetched, Y saved
   ```

#### Verify Data in Database

```sql
-- Check reviews were saved
SELECT COUNT(*) as total_reviews FROM reviews;

-- Check by source
SELECT source, COUNT(*) as count 
FROM reviews 
GROUP BY source;

-- Check ratings
SELECT AVG(rating) as avg_rating, 
       MIN(rating) as min_rating, 
       MAX(rating) as max_rating 
FROM reviews 
WHERE is_active = true;

-- View latest reviews
SELECT user_name, rating, source, review_date, comment
FROM reviews 
ORDER BY review_date DESC 
LIMIT 5;
```

### 5. Integration Testing

#### BEDS24 Booking.com Integration

Expected behavior:
- ✅ Fetches reviews from Booking.com channel
- ✅ Maps fields: guestName, rating, comment, date
- ✅ Generates avatar placeholders
- ✅ Handles empty responses gracefully

Test:
```bash
# Check BEDS24 connection in logs
# After sync, look for: "Fetching Booking.com reviews from BEDS24..."
```

#### BEDS24 Airbnb Integration

Expected behavior:
- ✅ Attempts to fetch Airbnb reviews
- ℹ️ May return empty if endpoint not available
- ✅ Does not fail entire sync if unavailable

#### Google APIs Integration

**Google Places API:**
```bash
# Test API key manually
curl "https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&fields=reviews&key=YOUR_API_KEY"

# Should return reviews JSON
```

**Google My Business API:**
- Requires OAuth 2.0 setup
- More complex to test manually
- Check sync logs for success/failure

### 6. Error Handling Testing

#### Test API Failures

1. Temporarily break API endpoint:
   - Comment out Supabase client in `/api/reviews/route.ts`
   - Reload homepage
   - Verify static reviews still display (fallback)
   - Restore code

2. Test invalid credentials:
   - Set wrong Google API key
   - Trigger sync
   - Verify: Google sync fails but others succeed
   - Restore correct key

#### Test Empty Database

1. Clear reviews table:
```sql
DELETE FROM reviews;
```

2. Visit homepage
3. Verify: Static reviews display (fallback)

4. Run sync again to restore data

### 7. Structured Data Validation

1. View page source: `http://localhost:3000`
2. Search for `"@type": "AggregateRating"`
3. Verify:
   - [ ] `ratingValue` is numeric (e.g., "4.8")
   - [ ] `reviewCount` matches database count
   - [ ] Data updates after sync

Test with Google's tool:
- Visit [Rich Results Test](https://search.google.com/test/rich-results)
- Enter your URL
- Verify no errors in structured data

### 8. Performance Testing

#### Page Load Time

1. Open DevTools → Network tab
2. Reload homepage
3. Check `/api/reviews` response time
4. Should be < 500ms (with cache: < 100ms)

#### Sync Duration

1. Time a full sync operation
2. Expected times:
   - BEDS24 only: 5-10 seconds
   - With Google: 10-30 seconds
3. If > 60 seconds, check:
   - Network connectivity
   - API rate limits
   - Server resources

### 9. Mobile Responsiveness

1. Open DevTools → Device toolbar
2. Test different screen sizes:
   - [ ] iPhone SE (375px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)

3. Verify:
   - [ ] Carousel scrolls smoothly
   - [ ] Cards stack properly
   - [ ] Touch gestures work
   - [ ] No horizontal overflow

### 10. Cron Job Testing

#### Local Testing

```bash
# Test cron endpoint manually
curl -X GET http://localhost:3000/api/cron/sync-reviews \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Should return sync stats
```

#### Production Testing (After Deploy)

1. Deploy to Vercel
2. Check Vercel Dashboard → Cron Jobs
3. Verify job is scheduled
4. Wait for first run (or trigger manually)
5. Check logs for success

## 🐛 Common Issues & Solutions

### Issue: No reviews displaying

**Solution:**
1. Check browser console for errors
2. Verify `/api/reviews` returns data
3. Check Supabase connection
4. Run sync if database is empty

### Issue: BEDS24 sync fails

**Solution:**
1. Verify tokens in `.env.local`
2. Check token expiration
3. Test BEDS24 API manually
4. Check property/room IDs

### Issue: Google sync fails

**Solution:**
1. Verify API credentials
2. Check API is enabled in Google Cloud
3. Verify Place ID is correct
4. Check API quota limits

### Issue: Admin dashboard not accessible

**Solution:**
1. Check authentication (NextAuth)
2. Verify user has admin role
3. Check session configuration
4. Clear cookies and re-login

### Issue: Cron job not running

**Solution:**
1. Verify `vercel.json` exists
2. Check Vercel environment variables
3. Verify `CRON_SECRET` is set
4. Check Vercel cron job status

## 📊 Expected Results

After successful setup and first sync:

- **Database:** 20-100+ reviews (depends on your properties)
- **Homepage:** Reviews carousel with mixed sources
- **Admin Dashboard:** Statistics showing counts by source
- **Structured Data:** Real ratings and review count
- **API Response Time:** < 500ms
- **Sync Duration:** 10-30 seconds

## ✨ Success Criteria

System is working correctly when:

- [x] Database migration completed
- [x] At least one source syncs successfully
- [x] Reviews display on homepage
- [x] Admin dashboard shows statistics
- [x] Manual sync works from admin panel
- [x] API endpoints respond correctly
- [x] Structured data updated with real values
- [x] Fallback to static reviews works
- [x] Mobile display is responsive
- [x] No console errors on homepage

## 🎉 Next Steps

Once all tests pass:

1. Configure Google APIs for maximum coverage
2. Set up production environment variables in Vercel
3. Deploy to production
4. Monitor first automatic sync
5. Share admin dashboard with your team
6. Enjoy automatic review updates!

## 📞 Support

If tests fail or you need help:
- Check console logs for detailed error messages
- Review setup guide in `REVIEWS_SETUP.md`
- Verify all environment variables
- Check Supabase and BEDS24 dashboards
