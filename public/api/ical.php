<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// כתובות ה-URL של קבצי ה-iCal
$AIRBNB_ICAL_URL = 'https://www.airbnb.com/calendar/ical/1491057188555346537.ics?s=2c713733855705f1fad44dac7265f995&locale=he';
$BOOKING_ICAL_URL = 'https://ical.booking.com/v1/export?t=ef24eeab-5528-4e3c-9922-25a7c313426f';

$results = [];

// פונקציה לטעינת iCal
function fetchICal($url, $source) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $content = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return [
            'source' => $source,
            'content' => '',
            'error' => $error
        ];
    }
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return [
            'source' => $source,
            'content' => $content
        ];
    } else {
        return [
            'source' => $source,
            'content' => '',
            'error' => "HTTP Status: $httpCode"
        ];
    }
}

// טעינת Airbnb
$results[] = fetchICal($AIRBNB_ICAL_URL, 'airbnb');

// טעינת Booking.com
$results[] = fetchICal($BOOKING_ICAL_URL, 'booking');

// החזרת התוצאות כ-JSON
echo json_encode(['results' => $results], JSON_UNESCAPED_UNICODE);
?>

