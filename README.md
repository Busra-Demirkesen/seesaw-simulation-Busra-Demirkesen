# ⚖️ Tahterevalli Simülasyonu — *Saf JavaScript ile Fizik Uygulaması*

[![GitHub repo size](https://img.shields.io/github/repo-size/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git)](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git)
[![GitHub language count](https://img.shields.io/github/languages/count/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git)](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git)
[![GitHub Pages Status](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen/actions/workflows/pages/pages-build-deployment/badge.svg)](https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/)

> 🎯 **HTML, CSS ve Vanilla JavaScript** kullanarak geliştirilmiş etkileşimli bir tahterevalli simülasyonu.
> Kullanıcı, tahterevallinin üzerine tıklayarak rastgele ağırlıklarda (1–10 kg) nesneler bırakabilir.
> Tahterevalli, bu nesnelerin tork etkisine göre **gerçekçi bir şekilde eğilir ve dengelenir**.

---

## 🌐 Canlı Demo
🔗 **GitHub Pages:** [https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/](https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/)
📦 **Repo:** [https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen)

---

## 🧩 Proje Özeti
Bu proje, **yalnızca HTML, CSS ve saf JavaScript** kullanarak fiziksel denge prensibini görselleştirmeyi amaçlar.
Kullanıcı her tıkladığında yeni bir nesne oluşturulur, tork hesaplanır, tahterevalli eğim açısını günceller ve animasyonlu olarak yeni konumuna döner.

---

## ⚙️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|------------|-----------|
| 💻 **HTML5** | Sayfa yapısı ve temel iskelet |
| 🎨 **CSS3** | Görsel tasarım, animasyon ve responsive yapı |
| ⚡ **JavaScript (ES6)** | Fizik hesaplamaları, olay yönetimi, DOM manipülasyonu |
| 💾 **LocalStorage** | Sayfa yenilense bile nesneleri ve açıyı saklama |

---

## 🚀 Özellikler

✅ Tıklama ile rastgele (1–10 kg) ağırlıkta nesne oluşturma
✅ Gerçek zamanlı **tork ve açı hesaplaması**
✅ Akıcı **dönme animasyonu**
✅ Sol / sağ tarafın toplam ağırlık, tork ve nesne sayısının canlı güncellenmesi
✅ Açı bilgisinin dinamik olarak gösterilmesi
✅ **LocalStorage** ile kalıcı veri saklama
✅ Reset butonu ile sıfırlama
✅ Tamamen responsive tasarım (mobil uyumlu)
✅ İsteğe bağlı düşme sesi efekti 🎧

---

## ⚖️ Fiziksel Mantık

Tahterevalli, **tork dengesine** göre eğilir:

```javascript
// Her nesne için tork hesabı
const torque = obj.weight * Math.abs(obj.distanceFromPivot);

// Açının hesaplanması (maksimum ±30 derece)
const raw = (rightTorque - leftTorque) / 10;
const angle = Math.max(-30, Math.min(30, raw));



