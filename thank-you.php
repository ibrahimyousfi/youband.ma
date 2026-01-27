<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    function getDeviceType($ua) {
        if (stripos($ua, 'iPad') !== false) return 'Tablet';
        if (preg_match('/Mobile|Android|iPhone/i', $ua)) return 'Mobile';
        return 'Desktop';
    }

    $url = 'https://script.google.com/macros/s/AKfycbwRH0mKWU_4WnjOPG1jKUNCUKhIkkzIYZz4XJ_WSDcViwWSGv92YEJ66wjNlaR5UZRg/exec';

    $data = [];
    $data['form_name'] = $_POST['form_name'] ?? 'Form';
    $data['timestamp'] = date('Y-m-d H:i:s');
    $data['device_type'] = getDeviceType($_SERVER['HTTP_USER_AGENT'] ?? '');

    foreach ($_POST as $k => $v) {
        if ($k !== 'form_name' && $k !== 'timestamp' && $k !== 'device_type' && !empty($v)) {
            $data[$k] = $v;
        }
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    @curl_exec($ch);
    curl_close($ch);
}
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/webp" href="icon.webp">
    <title>Merci - Adflix</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="common.css">
    <script src="facebook-pixel.js"></script>
    <script>initFacebookPixel('1467345031326030');</script>
    <style>
        body { font-family: 'Tajawal', sans-serif; background-color: #121212; }
        .glow-effect { position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 256px; height: 256px; background: rgba(184, 148, 31, 0.2); border-radius: 50%; filter: blur(60px); opacity: 0.5; }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <header class="py-3 text-center bg-gray-900">
        <div class="max-w-7xl mx-auto px-4">
            <img src="youbrand-logo.webp" alt="Logo" class="mx-auto block max-h-20" loading="lazy">
        </div>
    </header>
    <main class="flex justify-center pt-4 pb-5 px-4">
        <div class="relative bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8 md:p-8 text-center max-w-lg">
            <div class="glow-effect"></div>
            <div class="relative">
                <div class="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-[#B8941F] mx-auto" width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold mb-4">Merci de nous avoir contactés</h1>
                <p class="text-gray-400 mb-5">Nous avons bien reçu votre message. Pour accélérer le traitement de votre demande et lui donner la priorité, nous vous recommandons de nous contacter directement via WhatsApp.</p>
                <a href="https://wa.me/message/FZGWHQYUN64SD1" class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full px-6 py-3 shadow-lg transition" target="_blank">
                    <i class="fab fa-whatsapp mr-2"></i>
                    Contactez-nous via WhatsApp
                </a>
            </div>
        </div>
    </main>
</body>
</html>
