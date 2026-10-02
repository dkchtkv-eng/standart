<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Метод не поддерживается.'], JSON_UNESCAPED_UNICODE); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true], JSON_UNESCAPED_UNICODE); exit; }
$phone = trim((string)($_POST['phone'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$source = trim((string)($_POST['source'] ?? 'Сайт'));
if ($phone === '' || $message === '') { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Укажите телефон и опишите задачу.'], JSON_UNESCAPED_UNICODE); exit; }
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Проверьте адрес электронной почты.'], JSON_UNESCAPED_UNICODE); exit; }
$to = 'mail@standart.su';
$subject = 'Новый запрос с сайта СТАНДАРТ';
$body = "Источник: {$source}\nТелефон: {$phone}\nПочта: {$email}\n\nЗапрос:\n{$message}\n\nДата: ".date('d.m.Y H:i');
$headers = "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nFrom: site@standart.su\r\n";
if ($email !== '') $headers .= "Reply-To: {$email}\r\n";
$sent = @mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $body, $headers);
if (!$sent) { http_response_code(500); echo json_encode(['ok'=>false,'message'=>'Сервер не отправил письмо. Позвоните нам: +7 4942 39 00 71'], JSON_UNESCAPED_UNICODE); exit; }
echo json_encode(['ok'=>true,'message'=>'Заявка отправлена.'], JSON_UNESCAPED_UNICODE);
