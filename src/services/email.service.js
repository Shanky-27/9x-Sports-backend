import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


export const sendOrderEmail = async(order)=>{
const trackingUrl = `${process.env.FRONTEND_URL}/tracking/${order.awb}`;
 const products =
        order.product_details ||
        order.request_payload?.cart ||
        [];

    const product =
        products[0] || {
            name: "NX Sports Gear Product",
            image:
                "https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/hero.png",
            price: order.invoice_value || 0,
            size: "-",
            qty: 1
        };
    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: order.customer_email,

        subject:"Order Confirmation - Your Order Has Been Placed",

        html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
  body, table, td {
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
    background: #000000;
  }

  img {
    border: 0;
    outline: none;
    text-decoration: none;
    display: block;
  }

  .l{
margin: -20px 0 0 0;
  }
  table {
    border-collapse: collapse !important;
  }

  a {
    text-decoration: none;
  }

  @media only screen and (max-width: 620px) {
    .container {
      width: 100% !important;
    }

    .stack {
      display: block !important;
      width: 100% !important;
      text-align: center !important;
      padding-bottom: 14px !important;
    }

    .divider-v {
      display: none !important;
    }

    .mobile-center {
      text-align: center !important;
    }
  }
</style>
</head>

<body style="margin:0; padding:0; background:#000000;">

<!-- PREHEADER -->
<div style="
display:none;
max-height:0;
overflow:hidden;
opacity:0;
">
Your NX order is confirmed and being prepared for dispatch.
</div>


<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="background:#000000;">

<tr>
<td align="center" style="padding:32px 12px;">


<!-- MAIN CONTAINER -->

<table role="presentation"
class="container"
width="650"
cellpadding="0"
cellspacing="0"
style="
width:650px;
max-width:650px;
background:#060608;
border:1px solid #241a35;
border-radius:14px;
overflow:hidden;
">


<!-- ===================================================== -->
<!-- HEADER -->
<!-- ===================================================== -->

<tr>
<td align="center"
style="
padding:40px 24px 26px 24px;
border-bottom:1px solid #1c1526;
background:#060608;
">

<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/logo.png"
width="180"
style="display:block; margin:0 auto;"
>

<h2 style="
font-family:Helvetica;
letter-spacing:6px;
font-weight:bold;
color:white;
margin:-10px 0 0 0;
">
NX SPORTS GEAR</h2>

<p style="
font-family:Arial,Helvetica,sans-serif;
font-size:9px;
letter-spacing:2px;
font-weight:bold;
color:#a855f7;
margin:14px 0 0 0;
">
PERFORMANCE STARTS HERE.
</p>

</td>
</tr>


<!-- ===================================================== -->
<!-- CONFIRMATION -->
<!-- ===================================================== -->

<tr>
<td align="center"
style="
padding:34px 24px 8px 24px;
">

<span style="
font-family:Arial,Helvetica,sans-serif;
font-size:25px;
line-height:30px;
font-weight:800;
color:#f5f5f5;
letter-spacing:0.3px;
">
YOUR ORDER IS CONFIRMED!⚽
</span>

</td>
</tr>


<tr>
<td align="center"
style="padding:0 24px 26px 24px;">

<span style="
font-family:Arial,Helvetica,sans-serif;
font-size:14px;
font-weight:700;
color:#a855f7;
">
Thank you for choosing NX.
</span>

</td>
</tr>


<!-- GREETING -->

<tr>
<td style="padding:0 34px 22px 34px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>
<td align="center"
style="
font-family:Arial,Helvetica,sans-serif;
font-size:16px;
color:#e8e8e8;
padding-bottom:10px;
">

Hi
<span style="
color:#a855f7;
font-weight:700;
">
${order.customer_name}
</span>,

</td>
</tr>


<tr>
<td align="center"
style="
font-family:Arial,Helvetica,sans-serif;
font-size:13.5px;
line-height:21px;
color:#96969a;
">

We're excited to let you know that your order has been successfully
confirmed and is now being prepared for dispatch.

</td>
</tr>

</table>

</td>
</tr>


<!-- ===================================================== -->
<!-- ORDER SUMMARY CARD -->
<!-- ===================================================== -->

<tr>
<td style="padding:6px 20px 18px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#0b0b0f;
border:1px solid #221933;
border-radius:12px;
">


<!-- CARD TITLE -->

<tr>
<td style="padding:20px 20px 16px 20px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:32px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/bag.png"
width="24"
height="24"

>
</div>
</td>

<td style="
padding-left:10px;
font-family:Arial,Helvetica,sans-serif;
font-size:14px;
font-weight:800;
letter-spacing:0.4px;
color:#f0f0f0;
">

ORDER SUMMARY

</td>

</tr>

</table>

</td>
</tr>


<!-- PRODUCT -->

<tr>
<td style="padding:0 20px 18px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<td width="106"
valign="top"
style="padding-right:16px;">

<img
src="${product.image}"
width="90"
style="display:block;"
>

</td>


<td valign="top">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<td style="
font-family:Arial,Helvetica,sans-serif;
font-size:15px;
font-weight:800;
color:#f2f2f2;
">

${product.name}

</td>

<td align="right"
style="
font-family:Arial,Helvetica,sans-serif;
font-size:15px;
font-weight:800;
color:#f2f2f2;
white-space:nowrap;
">

₹${Number(product.price || 0).toLocaleString("en-IN")}

</td>

</tr>

</table>


<p style="
margin:10px 0 5px 0;
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#8f8f93;
">

Colour:
<span style="
color:#a855f7;
font-weight:600;
">
Black / Purple
</span>

</p>


<p style="
margin:0 0 5px 0;
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#8f8f93;
">

Size:
<span style="color:#d8d8d8;">
UK ${product.size}
</span>

</p>


<p style="
margin:0;
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#8f8f93;
">

Quantity:
<span style="color:#d8d8d8;">
${product.qty }
</span>

</p>

</td>

</tr>

</table>

</td>
</tr>


<!-- DIVIDER -->

<tr>
<td style="padding:0 20px;">

<div style="
border-top:1px solid #1c1526;
font-size:1px;
line-height:1px;
">
&nbsp;
</div>

</td>
</tr>


<!-- DETAILS GRID -->

<tr>
<td style="padding:18px 20px 20px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">


<!-- ROW 1 -->

<tr>

<td width="50%"
valign="top"
style="padding-bottom:18px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/document.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:10px;">

<div style="
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
">
ORDER ID
</div>

<div style="
font-size:13px;
color:#e6e6e6;
font-weight:600;
">
${order.order_reference}
</div>

</td>

</tr>

</table>

</td>


<td width="50%"
valign="top"
style="padding-bottom:18px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/dates.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:10px;">

<div style="
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
">
TRACKING ID
</div>

<div style="
font-size:13px;
color:#a855f7;
font-weight:700;
">
${order.awb}
</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- ROW 2 -->

<tr>

<td width="50%"
valign="top"
style="padding-bottom:18px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/rupee-indian.png"
width="24"
height="24"
>
</div>

</td>

<td style="padding-left:10px;">

<div style="
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
">
AMOUNT PAID
</div>

<div style="
font-size:13px;
color:#e6e6e6;
font-weight:600;
">
₹${order.invoice_value}
</div>

</td>

</tr>

</table>

</td>


<td width="50%"
valign="top"
style="padding-bottom:18px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/credit.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:10px;">

<div style="
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
">
PAYMENT METHOD
</div>

<div style="
font-size:13px;
color:#e6e6e6;
font-weight:600;
">
${order.payment_mode}
</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- ROW 3 -->

<tr>

<td width="50%"
valign="top">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/cargo-truck.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:10px;">

<div style="
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
">
SERVICE
</div>

<div style="
font-size:13px;
color:#e6e6e6;
font-weight:600;
">
${order.service_type}
</div>

</td>

</tr>

</table>

</td>

<td width="50%">&nbsp;</td>

</tr>

</table>

</td>
</tr>


</table>

</td>
</tr>


<!-- ===================================================== -->
<!-- TRACK BUTTON -->
<!-- ===================================================== -->

<tr>
<td align="center"
style="padding:2px 20px 22px 20px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">


</table>

</td>
</tr>


<!-- ===================================================== -->
<!-- SHIPPING DETAILS -->
<!-- ===================================================== -->

<tr>
<td style="padding:0 20px 18px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#0b0b0f;
border:1px solid #221933;
border-radius:12px;
">


<!-- ===================================================== -->
<!-- SHIPPING DETAILS -->
<!-- ===================================================== -->

<tr>
<td style="padding:0 20px 18px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#0b0b0f;
border:1px solid #221933;
border-radius:12px;
">


<!-- TITLE -->

<tr>
<td style="padding:20px 20px 16px 20px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:32px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
border:1.5px solid #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/cargo-truck.png"
width="24"
height="24"
style="display:block;"
>
</div>
</td>

<td style="
padding-left:10px;
font-family:Arial,Helvetica,sans-serif;
font-size:14px;
font-weight:800;
letter-spacing:0.4px;
color:#f0f0f0;
">

SHIPPING DETAILS

</td>

</tr>

</table>

</td>
</tr>


<!-- SHIPPING CONTENT -->

<tr>
<td style="padding:0 20px 22px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<!-- COURIER -->

<td width="34%"
valign="top"
class="stack"
style="padding-right:10px;">

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
padding-bottom:4px;
">
COURIER PARTNER
</div>

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#e6e6e6;
font-weight:600;
">
${order.carrier}
</div>

</td>


<!-- TRACKING -->

<td width="33%"
valign="top"
class="stack"
style="padding-right:10px;">

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
padding-bottom:4px;
">
TRACKING ID
</div>

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#a855f7;
font-weight:700;
">
${order.awb}
</div>

</td>


<!-- DELIVERY -->

<td width="33%"
valign="top"
class="stack">

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:10.5px;
letter-spacing:0.4px;
color:#7d7d82;
padding-bottom:4px;
">
ESTIMATED DELIVERY
</div>

<div style="
font-family:Arial,Helvetica,sans-serif;
font-size:12.5px;
color:#e6e6e6;
font-weight:600;
">
3 – 6 Business Days
</div>

</td>

</tr>

</table>

</td>
</tr>


<!-- DIVIDER -->

<tr>
<td style="padding:0 20px;">

<div style="
border-top:1px solid #1c1526;
font-size:1px;
line-height:1px;
">
&nbsp;
</div>

</td>
</tr>


<!-- TRACK BUTTON -->

<tr>
<td align="center"
style="padding:20px 20px 22px 20px;">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td align="center"
bgcolor="#8b3ee8"
style="
border-radius:8px;
background:#8b3ee8;
">

<a href="${trackingUrl}"
target="_blank"
style="
display:inline-block;
padding:14px 34px;
font-family:Arial,Helvetica,sans-serif;
font-size:13.5px;
font-weight:800;
letter-spacing:0.4px;
color:#ffffff;
text-decoration:none;
">

<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/box.png"
width="20"
height="20"
style="
display:inline-block;
vertical-align:middle;
margin-right:8px;
"
>

<span style="
vertical-align:middle;
">
TRACK MY ORDER
</span>

</a>

</td>

</tr>

</table>

</td>
</tr>


</table>

</td>
</tr>

<!-- ===================================================== -->
<!-- CONTACT BAR -->
<!-- ===================================================== -->

<tr>
<td style="padding:0 20px 20px 20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#0b0b0f;
border:1px solid #221933;
border-radius:12px;
">


<tr>

<td style="padding:20px;">

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>


<!-- HELP -->

<td width="33%"
valign="middle"
class="stack">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
background-color: #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/customer-service-headset.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:8px;">

<div style="
font-size:11.5px;
font-weight:800;
color:#f0f0f0;
">
NEED HELP?
</div>

<div style="
font-size:10.5px;
color:#8f8f93;
">
We're here for you.
</div>

</td>

</tr>

</table>

</td>


<!-- EMAIL -->

<td width="33%"
valign="middle"
class="stack">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
background-color: #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/email.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:8px;">

<div style="
font-size:11.5px;
font-weight:800;
color:#f0f0f0;
">
EMAIL US
</div>

<div style="
font-size:10.5px;
color:#8f8f93;
">
nxsportsgearofficial@gmail.com
</div>

</td>

</tr>

</table>

</td>


<!-- INSTAGRAM -->

<td width="33%"
valign="middle"
class="stack">

<table role="presentation"
cellpadding="0"
cellspacing="0">

<tr>

<td style="width:30px;">
<div style="
height:fit-content;
width: fit-content;
padding: 5px;
background-color: #a855f7;
border-radius:50%;">
<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/instagram.png"
width="24"
height="24"
>
</div>
</td>

<td style="padding-left:8px;">

<div style="
font-size:11.5px;
font-weight:800;
color:#f0f0f0;
">
INSTAGRAM
</div>

<div style="
font-size:10.5px;
color:#8f8f93;
">
@nxsportsgear
</div>

</td>

</tr>

</table>

</td>


</tr>

</table>

</td>

</tr>

</table>

</td>
</tr>


<!-- ===================================================== -->
<!-- FOOTER -->
<!-- ===================================================== -->

<tr>

<td style="
padding:24px 26px 10px 26px;
border-top:1px solid #1c1526;
">


<!-- FOOTER TOP -->

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<td width="46"
valign="top">

<img class="l"
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/logo.png"
height="75"
>

</td>


<td valign="top"
style="padding-left:10px;">

<div style="
font-size:12px;
font-weight:800;
letter-spacing:0.4px;
color:#a855f7;
padding-bottom:4px;
">

THANK YOU FOR TRUSTING NX.

</div>

<div style="
font-size:11.5px;
line-height:17px;
color:#8f8f93;
">

Every step you take is built for speed,
comfort and performance.

</div>

</td>

</tr>

</table>


<!-- FEATURES -->

<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0"
style="margin-top:22px;">

<tr>


<td width="33%"
align="center"
class="stack">

<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/shield.png"
width="28"
height="28"
style="margin:0 auto;"
>

<div style="
font-size:9.5px;
letter-spacing:0.3px;
color:#7d7d82;
padding-top:4px;
">

PREMIUM<br>
QUALITY

</div>

</td>


<td width="33%"
align="center"
class="stack">

<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/sock.png"
width="28"
height="28"
style="margin:0 auto;"
>

<div style="
font-size:9.5px;
letter-spacing:0.3px;
color:#7d7d82;
padding-top:4px;
">

BUILT FOR<br>
PERFORMANCE

</div>

</td>


<td width="33%"
align="center"
class="stack">

<img
src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/internet.png"
width="28"
height="28"
style="margin:0 auto;"
>

<div style="
font-size:9.5px;
letter-spacing:0.3px;
color:#7d7d82;
padding-top:4px;
">

DESIGNED IN INDIA<br>
MADE FOR CHAMPIONS

</div>

</td>


</tr>

</table>

</td>

</tr>


<!-- ===================================================== -->
<!-- COPYRIGHT -->
<!-- ===================================================== -->

<tr>

<td style="padding:18px 26px 30px 26px;">

<div style="
border-top:1px solid #1c1526;
font-size:1px;
line-height:1px;
padding-top:16px;
">
&nbsp;
</div>


<table role="presentation"
width="100%"
cellpadding="0"
cellspacing="0">

<tr>

<td align="left"
class="stack"
style="
font-size:10.5px;
color:#5f5f63;
">

© 2026 NX Sports Gear Private Limited.
All Rights Reserved.

</td>


<td align="right"
class="stack"
style="
font-size:10.5px;
color:#5f5f63;
">

Designed in India &nbsp;•&nbsp; Made for Champions

</td>

</tr>

</table>

</td>

</tr>


</table>

</td>
</tr>

</table>

</body>
</html>
`
    };


    await transporter.sendMail(mailOptions);

};

export const sendNewsletterWelcomeEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to NX — You're In ⚡",

    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
  body {
    margin: 0;
    padding: 0;
    background: #000000;
    font-family: Arial, Helvetica, sans-serif;
  }

  table {
    border-collapse: collapse;
  }

  img {
    border: 0;
    display: block;
  }

  @media only screen and (max-width: 620px) {
    .container {
      width: 100% !important;
    }

    .content {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }

    .title {
      font-size: 25px !important;
    }

    .logo {
      width: 155px !important;
    }
  }
</style>
</head>

<body style="margin:0; padding:0; background:#000000;">

<!-- OUTER -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:100%;
    background:#000000;
  "
>
<tr>
<td align="center">

<!-- MAIN EMAIL -->

<table
  class="container"
  width="650"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:650px;
    max-width:650px;
    background:#030305;
    overflow:hidden;
  "
>

<!-- ================================= -->
<!-- HEADER -->
<!-- ================================= -->

<tr>
<td
  align="center"
  style="
    padding:28px 20px 20px;
    background:
      radial-gradient(
        ellipse at 50% 0%,
        rgba(120,40,255,0.18) 0%,
        rgba(30,10,60,0.08) 35%,
        #030305 70%
      );
  "
>

<!-- LOGO -->

<img
  class="logo"
  src="https://vhjphwsbneabpsoxyxti.supabase.co/storage/v1/object/public/logos/logo.png"
  width="170"
  alt="NX Sports Gear"
  style="
    width:170px;
    max-width:170px;
    height:auto;
    margin:0 auto;
  "
>

<!-- BRAND NAME -->

<div
  style="
    margin-top:10px;
    color:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
    font-size:13px;
    line-height:18px;
    font-weight:700;
    letter-spacing:6px;
  "
>
  NX SPORTS GEAR
</div>

<!-- TAGLINE -->

<div
  style="
    margin-top:8px;
    color:#a855f7;
    font-family:Arial,Helvetica,sans-serif;
    font-size:8px;
    line-height:12px;
    font-weight:700;
    letter-spacing:3px;
  "
>
  PERFORMANCE STARTS HERE.
</div>

</td>
</tr>


<!-- ================================= -->
<!-- PURPLE DIVIDER -->
<!-- ================================= -->

<tr>
<td style="padding:0 40px;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
>
<tr>
<td
  style="
    height:1px;
    background:#27143d;
    font-size:0;
    line-height:0;
  "
>
&nbsp;
</td>
</tr>
</table>

</td>
</tr>


<!-- ================================= -->
<!-- MAIN TITLE -->
<!-- ================================= -->

<tr>
<td
  class="content"
  align="center"
  style="
    padding:32px 30px 8px;
  "
>

<h1
  class="title"
  style="
    margin:0;
    padding:0;
    color:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
    font-size:27px;
    line-height:34px;
    font-weight:900;
    letter-spacing:0.5px;
  "
>
  WELCOME TO
  <span style="color:#8b3ee8;">NX</span>
  <span style="
  display:inline-block;
  vertical-align:middle;
  margin-left:4px;
">
  <svg
    width="18"
    height="24"
    viewBox="0 0 24 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5 1L3 18h7.5L8 31l13-19h-8L14.5 1z"
      fill="#a855f7"
    />
  </svg>
</span>
</h1>

</td>
</tr>


<!-- ================================= -->
<!-- SUBTITLE -->
<!-- ================================= -->

<tr>
<td
  align="center"
  style="
    padding:2px 30px 20px;
  "
>

<div
  style="
    color:#a855f7;
    font-family:Arial,Helvetica,sans-serif;
    font-size:9px;
    line-height:14px;
    font-weight:700;
    letter-spacing:3px;
  "
>
  YOU'RE OFFICIALLY ON THE LIST.
</div>

</td>
</tr>


<!-- ================================= -->
<!-- INTRO -->
<!-- ================================= -->

<tr>
<td
  class="content"
  align="center"
  style="
    padding:0 35px 14px;
  "
>

<div
  style="
    color:#b7b7bd;
    font-family:Arial,Helvetica,sans-serif;
    font-size:11px;
    line-height:18px;
  "
>
  You're now part of the NX community.
</div>

</td>
</tr>


<tr>
<td
  class="content"
  align="center"
  style="
    padding:0 35px 12px;
  "
>

<div
  style="
    color:#b7b7bd;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10px;
    line-height:17px;
  "
>
  You'll be the first to know about:
</div>

</td>
</tr>


<!-- ================================= -->
<!-- BENEFITS -->
<!-- ================================= -->

<tr>
<td
  align="center"
  style="
    padding:0 30px 25px;
  "
>

<table
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    margin:0 auto;
  "
>

<!-- NEW DROPS -->

<tr>
<td
  width="30"
  align="center"
  valign="middle"
  style="padding:0;"
>
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style="display:block;margin:auto;"
  >
    <path
      d="M13.5 2L5 13h6l-1 9 8.5-12h-6L13.5 2z"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
</td>

<td
  align="left"
  style="
    color:#eeeeee;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10px;
    line-height:28px;
    padding-left:5px;
  "
>
  New drops
</td>
</tr>


<!-- FOOTBALL -->

<tr>
<td
  width="30"
  align="center"
  valign="middle"
  style="padding:0;"
>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style="display:block;margin:auto;"
  >

    <!-- OUTER CIRCLE -->
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.7"
    />

    <!-- CENTER PENTAGON -->
    <path
      d="M12 7
         L16.1 10
         L14.5 14.8
         L9.5 14.8
         L7.9 10
         Z"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <!-- FOOTBALL LINES -->
    <path
      d="M12 7V3.2
         M7.9 10L4.5 7.8
         M9.5 14.8L7.5 18.3
         M14.5 14.8L16.5 18.3
         M16.1 10L19.5 7.8"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.4"
      stroke-linecap="round"
    />

  </svg>
</td>

<td
  align="left"
  style="
    color:#eeeeee;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10px;
    line-height:28px;
    padding-left:5px;
  "
>
  Football releases
</td>
</tr>


<!-- EXCLUSIVE -->

<tr>
<td
  width="30"
  align="center"
  valign="middle"
  style="padding:0;"
>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style="display:block;margin:auto;"
  >
    <path
      d="M12 2.5
         L14.7 8.8
         L21.5 9.2
         L16.2 13.5
         L17.9 20.2
         L12 16.5
         L6.1 20.2
         L7.8 13.5
         L2.5 9.2
         L9.3 8.8
         Z"
      fill="#a855f7"
    />
  </svg>
</td>

<td
  align="left"
  style="
    color:#eeeeee;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10px;
    line-height:28px;
    padding-left:5px;
  "
>
  Exclusive deals
</td>
</tr>

<!-- LIMITED -->

<tr>
<td
  width="30"
  align="center"
  valign="middle"
  style="padding:0;"
>
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style="display:block;margin:auto;"
  >
    <path
      d="M7 4h10v4.5a5 5 0 0 1-10 0V4z"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.4"
    />

    <path
      d="M7 6H4.5v2a3.5 3.5 0 0 0 3.5 3.5M17 6h2.5v2a3.5 3.5 0 0 1-3.5 3.5"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.4"
      stroke-linecap="round"
    />

    <path
      d="M12 13v4M8.5 20h7M10 17h4"
      fill="none"
      stroke="#a855f7"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>
</td>

<td
  align="left"
  style="
    color:#eeeeee;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10px;
    line-height:28px;
    padding-left:5px;
  "
>
  Limited editions
</td>
</tr>

</table>

</td>
</tr>


<!-- ================================= -->
<!-- CTA -->
<!-- ================================= -->

<tr>
<td
  align="center"
  style="
    padding:0 30px 32px;
  "
>

<a
  href="${process.env.FRONTEND_URL}"
  style="
    display:inline-block;
    min-width:135px;
    padding:11px 25px;
    background:#7025e8;
    background:linear-gradient(
      135deg,
      #7625f0 0%,
      #5220dc 100%
    );
    border-radius:7px;
    box-shadow:
      0 0 18px rgba(117,45,255,0.45),
      inset 0 1px 0 rgba(255,255,255,0.15);
    color:#ffffff;
    text-decoration:none;
    font-family:Arial,Helvetica,sans-serif;
    font-size:9px;
    line-height:16px;
    font-weight:800;
    letter-spacing:2px;
  "
>
  EXPLORE NX
  <span style="font-size:13px;">→</span>
</a>

</td>
</tr>


<!-- ================================= -->
<!-- FOOTER DIVIDER -->
<!-- ================================= -->

<tr>
<td style="padding:0 40px;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
>
<tr>

<td
  width="32%"
  style="
    height:1px;
    background:#241a35;
    font-size:0;
  "
>
&nbsp;
</td>

<td
  width="36%"
  align="center"
  style="
    padding:0 8px;
    color:#67636d;
    font-family:Arial,Helvetica,sans-serif;
    font-size:6px;
    letter-spacing:2px;
    white-space:nowrap;
  "
>
  FROM INDIA TO THE WORLD
</td>

<td
  width="32%"
  style="
    height:1px;
    background:#241a35;
    font-size:0;
  "
>
&nbsp;
</td>

</tr>
</table>

</td>
</tr>


<!-- ================================= -->
<!-- FOOTER -->
<!-- ================================= -->

<tr>
<td
  align="center"
  style="
    padding:10px 20px 20px;
    background:
      radial-gradient(
        ellipse at 50% 100%,
        rgba(101,35,220,0.28) 0%,
        rgba(50,15,100,0.12) 30%,
        #030305 70%
      );
  "
>

<div
  style="
    color:#77747d;
    font-family:Arial,Helvetica,sans-serif;
    font-size:6px;
    line-height:11px;
    letter-spacing:0.4px;
  "
>
  © 2026 NX Sports Gear Private Limited.
</div>

<div
  style="
    color:#77747d;
    font-family:Arial,Helvetica,sans-serif;
    font-size:6px;
    line-height:11px;
    letter-spacing:0.4px;
  "
>
  Designed in India • Made for Champions
</div>

</td>
</tr>


<!-- ================================= -->
<!-- BOTTOM PURPLE GLOW -->
<!-- ================================= -->

<tr>
<td
  style="
    height:12px;
    background:
      linear-gradient(
        90deg,
        #020204 0%,
        #241052 25%,
        #8b3ee8 50%,
        #241052 75%,
        #020204 100%
      );
    box-shadow:
      0 -5px 20px rgba(139,62,232,0.55);
    font-size:0;
    line-height:0;
  "
>
&nbsp;
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
    `
  };

  await transporter.sendMail(mailOptions);
};
