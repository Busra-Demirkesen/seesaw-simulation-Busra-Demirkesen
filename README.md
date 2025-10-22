# Seesaw Simulation (Pure JS)

**EN (short):** A pure HTML/CSS/JS seesaw simulation. Click the plank to drop random-weight (1–10 kg) objects; the seesaw tilts based on torque. Smooth animation, state persistence, and UI stats. Includes a robust **hitbox + coordinate transform** fix so objects land exactly where you click even while the seesaw is rotated.

**TR (kısa):** Saf HTML/CSS/JS ile tahterevalli simülasyonu. Tahtaya tıklayınca rastgele ağırlıkta (1–10 kg) objeler düşer; tork farkına göre açı hesaplanır ve yumuşak bir animasyonla döner. LocalStorage ile durum saklanır. Dönerken oluşan tıklama sapmasını gidermek için **hitbox + koordinat dönüşümü** çözümü uygulanmıştır.

---

## 🔗 Demo
- GitHub Pages: `https://<username>.github.io/seesaw-simulation-Busra-Demirkesen/`
- Repo: `https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen`

> Not: Pages linkini düzenleyip burayı güncelle.

---

## 🎯 Özellikler
- Tıklanan noktaya **1–10 kg** rastgele ağırlıkta obje bırakma
- **Gerçekçi tork** hesabı: `torque = Σ(weight × distanceFromPivot)`
- **Açı sınırı:** ±30° (clamp)
- **Yumuşak tilt** animasyonu (CSS `transition`)
- **Durum kaydı:** LocalStorage ile sayfa yenilense de devam
- **UI istatistikleri:** sol/sağ toplam ağırlık, tork, obje sayısı, açı
- **Bonuslar:** reset butonu, obje üstünde ağırlık etiketi, görsel skala, ses efekti

---

## 🧠 Fizik Mantığı
- Tahta uzunluğu sabit (örn. **400px**), pivot tam ortada.
- Her obje için moment kolu: `|x - pivot|`
- Sol ve sağ torklar ayrı toplanır:
  ```js
  const torque = obj.weight * Math.abs(obj.distanceFromPivot);
