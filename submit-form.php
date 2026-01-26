<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function getDeviceType($userAgent) {
    if (stripos($userAgent, 'iPad') !== false) {
        return 'Tablet';
    }
    if (preg_match('/Mobile|Android|iPhone/i', $userAgent)) {
        return 'Mobile';
    }
    return 'Desktop';
}

$googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwRH0mKWU_4WnjOPG1jKUNCUKhIkkzIYZz4XJ_WSDcViwWSGv92YEJ66wjNlaR5UZRg/exec';

$params = [];
$params['form_name'] = $_POST['form_name'] ?? 'Form';
$params['timestamp'] = date('Y-m-d H:i:s');
$params['device_type'] = getDeviceType($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown');
$params['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

foreach ($_POST as $key => $value) {
    if ($key !== 'form_name' && $key !== 'timestamp' && $key !== 'device_type' && $key !== 'user_agent') {
        if (isset($value) && $value !== '') {
            $params[$key] = $value;
        }
    }
}

$postData = http_build_query($params);

$ch = curl_init($googleScriptUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

curl_exec($ch);
curl_close($ch);

echo json_encode(['success' => true]);
?>
