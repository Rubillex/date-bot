# Telegram Mini App — Romantic Date Invitation

## Project Overview

This project is a romantic Telegram Mini App that acts as an interactive invitation to a date.

The app should feel:

- emotional,
- cinematic,
- elegant,
- personal,
- premium,
- intimate.

The experience should NOT feel like:

- a regular Telegram bot,
- a food delivery app,
- an admin panel,
- a utility application.

The core idea is progressive emotional storytelling through interaction.

---

# UX Goals

The application should create:

- anticipation,
- intrigue,
- emotional engagement,
- playful interaction,
- memorable moments.

The user should gradually discover:

1. the invitation,
2. the location,
3. the atmosphere,
4. the food,
5. mutual preferences.

---

# Main Application Flow

```text
Home Screen
    ↓
Place Details
    ↓
Photo Reveal Confirmation
    ↓
Place Gallery
    ↓
Food Menu
    ↓
Mutual Matches
```

---

# Design Direction

## Main Style

Hybrid between:

- Apple Invitations,
- luxury editorial UI,
- cinematic romantic interfaces,
- modern iOS aesthetics.

The design should feel:

- soft,
- atmospheric,
- spacious,
- elegant,
- minimalistic.

---

# Color Palette

## Background

```css
#0F0F14
```

Dark graphite instead of pure black.

---

## Surface

```css
#1B1B24
```

Used for cards and modal surfaces.

---

## Surface Soft

```css
#242433
```

Used for secondary UI elements.

---

## Primary Accent

```css
#A78BFA
```

Soft lavender accent.

---

## Secondary Accent

```css
#C4B5FD
```

Light lavender.

---

## Romantic Accent

```css
#F472B6
```

Used for:

- mutual food matches,
- romantic highlights,
- emotional states.

---

## Romantic Soft

```css
#FBCFE8
```

Soft romantic glow.

---

## Warm Accent

```css
#F5D0FE
```

Used for highlights and subtle gradients.

---

## Main Text

```css
#FFFFFF
```

---

## Secondary Text

```css
#B8B8C7
```

---

# Typography

## Main UI Font

Inter

Used for:

- body text,
- buttons,
- labels,
- cards.

---

## Display Font

Cormorant Garamond

Alternative:

- Playfair Display

Used for:

- large headers,
- emotional typography,
- editorial sections.

---

# Visual Principles

## Use

- soft shadows,
- blur backgrounds,
- large border radius,
- smooth gradients,
- cinematic imagery,
- spacious layout,
- slow smooth animations,
- subtle glow effects.

---

## Avoid

- bright Telegram blue,
- sharp corners,
- heavy Material Design look,
- aggressive gradients,
- cluttered layouts,
- overly playful cartoon style.

---

# Screen 1 — Home Screen

## Purpose

Create emotional intrigue.

---

## Layout

Fullscreen hero section.

---

## Content Example

```text
У меня есть для тебя приглашение ✨

Я кое-что подготовил.
Немного интриги, немного вкусного
и одно место, которое тебе понравится.
```

---

## CTA Button

```text
Посмотреть детали
```

---

## UX Notes

Use:

- fade-in animation,
- soft background glow,
- subtle floating particles,
- large editorial typography,
- centered emotional composition.

---

# Screen 2 — Place Details

## Content

- place name,
- date,
- time,
- address,
- short description,
- recommendations,
- photo reveal button.

---

## Recommendation Chips

```text
✨ одеться удобно
🌙 вечерний стиль
👟 обувь без каблуков
🖤 можно что-то темное
```

---

## Reveal Button

```text
Посмотреть фото места
```

---

## Confirmation Modal

Before showing photos display custom bottom sheet:

```text
Точно хочешь увидеть?

Я старался сохранить интригу ✨
```

Buttons:

- Сохранить сюрприз
- Показать

---

## UX Notes

Use:

- custom bottom sheet,
- blur backdrop,
- spring animation,
- large rounded corners.

Do NOT use:

- native browser alert,
- simple popup window.

---

# Screen 3 — Place Gallery

## Layout

Fullscreen image carousel.

---

## Features

- swipe gestures,
- blurred background,
- cinematic image crop,
- smooth transitions,
- immersive viewing.

---

## Important

DO NOT use image grid layout.

The gallery should feel cinematic.

---

# Screen 4 — Food Menu

## Main Idea

Users can select dishes they want.

If both users selected the same dish:

- show mutual match state,
- highlight emotionally,
- trigger small animation.

---

# Restaurant Navigation

Use horizontal chips instead of dropdown.

Example:

```text
[ Italian ]
[ Sushi ]
[ Dessert ]
```

---

# Food Card Structure

```text
[ image ]

Название блюда
Описание блюда

[ Хочу ✨ ]

❤️ Вы оба хотите это
```

---

# Food Card States

## Default

Dark neutral card.

---

## User Selected

Lavender glow/border.

---

## Mutual Match

Pink glow + subtle romantic animation.

---

# Mutual Match UX

When both users selected the same dish:

- heart burst animation,
- spring transition,
- glow pulse,
- haptic success feedback.

This moment should feel emotionally rewarding.

---

# Motion Design

## General Rules

Animations should feel:

- slow,
- elegant,
- soft,
- polished,
- cinematic.

NOT flashy.

---

# Recommended Animations

## Home Screen

- fade in,
- floating particles,
- slow parallax.

---

## Buttons

- scale down to 0.98 on press,
- soft glow effect.

---

## Bottom Sheet

- spring slide animation.

---

## Mutual Match

- heart burst,
- glow pulse,
- spring scale animation,
- subtle haptic feedback.

---

# Telegram Mini App Integration

Use:

- Telegram theme variables,
- safe area support,
- viewport expand(),
- haptic feedback,
- BackButton,
- MainButton,
- swipe gestures.

---

# Recommended Stack

## Frontend

- Nuxt 3
- Vue 3
- TypeScript
- TailwindCSS
- shadcn-vue

---

## Animation

- VueUse Motion
- GSAP (only where necessary)

---

## Telegram SDK

Choose one:

- @telegram-apps/sdk
- @tma.js/sdk

---

# Suggested Project Structure

```text
app/
  components/
    app/
    date/
    menu/
    ui/

  composables/
    useTelegram.ts
    useDateState.ts
    useFoodWants.ts

  data/
    date.ts
    restaurants.ts

  pages/
    index.vue
    place.vue
    menu.vue

  assets/
    css/
      main.css
```

---

# Example Data Model — date.ts

```ts
export const dateInfo = {
  title: "У меня есть для тебя приглашение ✨",

  subtitle:
    "Я кое-что подготовил. Немного интриги, немного вкусного и одно место, которое тебе понравится.",

  date: "Суббота",
  time: "19:30",

  placeName: "Место под стеклянным куполом",

  address: "...",

  description: "Тихое место с красивым видом и атмосферой для вечера вдвоем.",

  recommendations: ["одеться удобно", "вечерний стиль", "обувь без каблуков"],

  photos: [],
};
```

---

# Example Data Model — restaurants.ts

```ts
export type FoodItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  partnerWants?: boolean;
};

export type Restaurant = {
  id: string;
  title: string;
  description: string;
  items: FoodItem[];
};
```

---

# Tailwind Theme Example

```ts
colors: {
  date: {
    bg: '#0F0F14',
    surface: '#1B1B24',
    surfaceSoft: '#242433',

    primary: '#A78BFA',
    primarySoft: '#C4B5FD',

    romantic: '#F472B6',
    romanticSoft: '#FBCFE8',

    text: '#FFFFFF',
    muted: '#B8B8C7',
  },
}
```

---

# Additional Features (Recommended)

## Countdown Timer

```text
До свидания осталось:
2 дня · 04 часа · 18 минут
```

---

## Secret Final Screen

```text
Кажется, у нас есть совпадения ❤️
```

---

## Playful Copywriting

```text
Это не тест. Хотя правильные ответы есть.
```

```text
Подозрительно хороший выбор.
```

```text
Слишком вкусно, чтобы игнорировать.
```

---

# Navigation Recommendation

Preferred flow:

```text
Главная → Место → Меню
```

Instead of permanent bottom navigation.

Reason:
Sequential navigation creates stronger emotional storytelling.

---

# Development Phases

## Phase 1

- Nuxt setup
- Tailwind setup
- Static pages
- Base layout

---

## Phase 2

- Telegram SDK integration
- Safe area support
- Viewport expansion
- Haptic feedback

---

## Phase 3

- Bottom sheets
- Gallery
- Food interactions
- Mutual match logic

---

## Phase 4

- Motion polish
- Copywriting refinement
- UX polish
- Performance optimization

---

# Final Product Goal

The final experience should feel:

- romantic,
- atmospheric,
- elegant,
- emotionally memorable,
- cinematic,
- personal,
- interactive.

The application should feel more like:

- a digital emotional experience,
  than
- a traditional application.
