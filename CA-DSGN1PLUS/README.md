# CHANGEBODY — handoff для сборки в Figma

## Базовый размер frame
- Mobile frame: 390 × 844
- Safe area: 16 px с боков
- Bottom navigation: 72 px
- Основная CTA: высота 52–56 px

## Стиль
- Фон: #0B1220
- Поверхности: #132033 / #1A2A42
- Граница: #30425F
- Акцент: #14B8A6
- Текст: #F8FAFC / #CBD5E1
- Скругление карточек: 16 px

## Список frame
1. `01_Home`
2. `02_Diagnostic`
3. `03_Implants_Catalog`
4. `04_Implant_Detail`
5. `05_Bodies_Catalog`
6. `06_Body_Detail`
7. `07_Cart_Checkout`
8. `08_Success`

## Прототипные связи
- `01_Home`
  - CTA `Начать подбор` -> `02_Diagnostic`
  - Карточка `Кибер-импланты` -> `03_Implants_Catalog`
  - Карточка `Новые тела` -> `05_Bodies_Catalog`
  - Bottom nav `Корзина` -> `07_Cart_Checkout`

- `02_Diagnostic`
  - `← Назад` -> `01_Home`
  - CTA `Продолжить` -> `03_Implants_Catalog`
  - Bottom nav `Импланты` -> `03_Implants_Catalog`

- `03_Implants_Catalog`
  - Первая карточка `NeuroKnee X7` -> `04_Implant_Detail`
  - Bottom nav `Домой` -> `01_Home`
  - Bottom nav `Тела` -> `05_Bodies_Catalog`
  - Bottom nav `Корзина` -> `07_Cart_Checkout`

- `04_Implant_Detail`
  - `← Назад` -> `03_Implants_Catalog`
  - CTA `Только имплант` -> `07_Cart_Checkout`
  - CTA `Добавить и выбрать тело` -> `05_Bodies_Catalog`

- `05_Bodies_Catalog`
  - Первая карточка `Atlas Soft 3077` -> `06_Body_Detail`
  - Bottom nav `Домой` -> `01_Home`
  - Bottom nav `Импланты` -> `03_Implants_Catalog`
  - Bottom nav `Корзина` -> `07_Cart_Checkout`

- `06_Body_Detail`
  - `← Назад` -> `05_Bodies_Catalog`
  - CTA `Добавить в корзину` -> `07_Cart_Checkout`

- `07_Cart_Checkout`
  - CTA `Подтвердить заказ` -> `08_Success`
  - Bottom nav `Домой` -> `01_Home`
  - Bottom nav `Импланты` -> `03_Implants_Catalog`
  - Bottom nav `Тела` -> `05_Bodies_Catalog`

- `08_Success`
  - CTA `В каталог` -> `01_Home`

## Что изменилось по сравнению с low-fi
- Отдельный экран фильтров не нужен: лучше chips + bottom sheet внутри каталога.
- Корзина и checkout объединены в один экран с карточками.
- Кнопка помощи и блок совместимости вынесены в постоянные элементы.

# CHANGEBODY — источники исследований

## Accessibility
- Apple Human Interface Guidelines
- Apple HIG: Accessibility
- Apple HIG: Typography
- Apple HIG: Designing for iOS
- Material Design 3: target sizes / structure
- W3C WCAG 2.2: Target Size (Minimum)
- W3C WCAG 2.2 overview

## Implant / prosthetics / support references
- Open Bionics — Hero Arm
- Össur — i-Limb apps hub
- Össur — my i-Limb app page
- App Store — my i-limb
- Unlimited Tomorrow — TrueLimb
- Unlimited Tomorrow — Overview / process
- Ottobock — home / clinic locator
- Cochlear — home / clinic finder
- Neuralink — patient portal / clinical trials

## Important note
В презентации референсы показаны как схематичные реконструкции логики экранов по официальным страницам и приложениям. Они нужны для UX-анализа и не претендуют на буквальное копирование фирменного интерфейса.

