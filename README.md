<div align="center">

# 🛒 CodeAlpha E-Commerce Store

**A full-featured e-commerce web application built with Django 5.0 and MySQL.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

*A modern, responsive e-commerce platform featuring authentication, live product search, cart, wishlist, and order management.*

[Features](#-features) · [Tech Stack](#-tech-stack) · [Installation](#-installation) · [Usage](#-usage) · [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

**CodeAlpha E-Commerce Store** is a production-ready Django application that delivers a complete online shopping experience — from product discovery to checkout and order tracking. It ships with a clean, mobile-responsive UI, live client-side search, and a personalized user dashboard.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 User Authentication & Profiles
- Custom registration with full name & email
- Secure login with password visibility toggle
- Personalized profile dashboard
- Editable personal details
- Order history per user

</td>
<td width="50%" valign="top">

### 🛍️ Product Catalog & Search
- Real-time JavaScript live search
- Detailed product pages
- Product images & specifications
- Category-based organization
- Stock availability indicators

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛒 Cart & Wishlist
- Real-time cart count via context processor
- Add / update / remove cart items
- Persistent wishlist management
- Quick-add from listing pages

</td>
<td width="50%" valign="top">

### 📦 Checkout & Orders
- Auto-filled user details at checkout
- Complete shipping form
- Order creation & tracking
- Order status lifecycle (pending → shipped → delivered)

</td>
</tr>
<tr>
<td width="50%" valign="top" colspan="2">

### 🛠️ Django Administrator
- Authentication (register & login)
- Order management, tracking & status lifecycle (pending → shipped → delivered)
- Cart & wishlist management
- Product management
- User & group management

</td>
</tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.13, Django 5.0 |
| **Database** | MySQL (XAMPP / MariaDB) |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Font Awesome 6 |
| **DB Connector** | `mysqlclient` / `PyMySQL` |
| **Tooling** | Git, Virtualenv, Django StaticFiles |

---

## 📂 Project Structure

```text
CodeAlpha_EcommerceStore/
│
├── accounts/               # Authentication & profile management
├── cart/                   # Shopping cart logic & context processors
├── history/                # Browsing / order history tracking
├── orders/                 # Order creation & checkout processing
├── products/               # Product catalog, views, and details
├── wishlist/               # Wishlist management
│
├── ecommerce_project/      # Main project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── static/                 # CSS, JS, and image assets
│   ├── css/style.css
│   └── js/main.js
│
├── media/                  # User-uploaded product images
├── templates/              # Base & shared HTML templates
├── manage.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### 1. Prerequisites

Make sure you have the following installed:

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **XAMPP** (Apache + MySQL) — [Download](https://www.apachefriends.org/)
- **Git** — [Download](https://git-scm.com/)

### 2. Clone the Repository

```bash
git clone https://github.com/Aliyuabk/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### 3. Create a Virtual Environment

<details>
<summary><b>Windows</b></summary>

```bash
python -m venv venv
venv\Scripts\activate
```
</details>

<details>
<summary><b>macOS / Linux</b></summary>

```bash
python3 -m venv venv
source venv/bin/activate
```
</details>

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🗄️ Database Configuration

1. **Start XAMPP** → launch **Apache** and **MySQL**.

2. **Create the database** via phpMyAdmin:
   - Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
   - Click **New** → name it `codealpha_db` → **Create**

3. **Verify** database settings in `ecommerce_project/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'codealpha_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

---

## 🚀 Running the Application

### 1. Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Create a Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 3. Start the Development Server

```bash
python manage.py runserver
```

### 4. Open in Your Browser

| Service | URL |
|---------|-----|
| 🛍️ **Store Front** | [http://127.0.0.1:8000/](http://127.0.0.1:8000/) |
| 🛠️ **Admin Panel** | [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) |

---

## 🌐 Key URLs

| Module | Path | Description |
|--------|------|-------------|
| **Products / Shop** | `/` | Main product page with live search |
| **Product Detail** | `/products/<slug>/` | Individual product detail page |
| **Cart** | `/cart/` | Shopping cart view |
| **Checkout** | `/orders/checkout/` | Shipping & payment form |
| **Orders** | `/orders/` | Order history list |
| **Wishlist** | `/wishlist/` | Saved items |
| **History** | `/history/` | Browsing history |
| **Register** | `/accounts/register/` | User sign-up form |
| **Login** | `/accounts/login/` | User authentication form |
| **Profile** | `/accounts/profile/` | Dashboard & profile edit |

---

## 📱 Accessing From a Mobile Device

To test the app on your phone (same Wi-Fi network):

```bash
python manage.py runserver 0.0.0.0:8000
```

Then visit `http://<your-lan-ip>:8000` on your phone.

> **Note:** Ensure `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` in `settings.py` include your LAN IP. See the *Mobile Access* section in the docs.

---

## 🧪 Development Tips

- **Live reload** is built into `runserver` — save a file and it reloads automatically.
- **Static files** are served by `runserver` when `DEBUG=True`.
- For production, run `python manage.py collectstatic` and serve via WhiteNoise or Nginx.

---

## 🛠️ Troubleshooting

<details>
<summary><b>❌ MySQL connection error</b></summary>

- Ensure **XAMPP MySQL** is running.
- Verify database name, user, and password in `settings.py`.
- If using `PyMySQL`, add to `ecommerce_project/__init__.py`:
  ```python
  import pymysql
  pymysql.install_as_MySQLdb()
  ```
</details>

<details>
<summary><b>❌ Static files not loading</b></summary>

- Confirm `DEBUG=True` in `settings.py`.
- Check `STATICFILES_DIRS` and `STATIC_URL` are configured.
- Run `python manage.py collectstatic` if needed.
</details>

<details>
<summary><b>❌ Can't access from phone</b></summary>

- Start server with `0.0.0.0:8000`, not `127.0.0.1:8000`.
- Add your LAN IP to `ALLOWED_HOSTS`.
- Allow port `8000` through your firewall.
- Ensure phone and PC are on the **same Wi-Fi** network.
</details>

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **CodeAlpha Internship** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**AliyuAbk**

- GitHub: [@Aliyuabk](https://github.com/Aliyuabk)
- Project: [CodeAlpha_EcommerceStore](https://github.com/Aliyuabk/CodeAlpha_EcommerceStore)
- Potifolio: [@Aliyudev](https://aliyudev.kowagurutech.ng/)

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ using Django & MySQL**

</div>