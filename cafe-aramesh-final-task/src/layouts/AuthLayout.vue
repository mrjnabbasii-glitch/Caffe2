<template>
  <main class="auth-page" dir="rtl">
    <header>
      <router-link to="/" class="auth-brand">☕ کافه آرامش</router-link>
      <router-link to="/" class="back-link"
        >بازگشت به خانه <span aria-hidden="true">←</span></router-link
      >
    </header>
    <section class="auth-stage" :class="{ 'is-register': registering }">
      <svg
        class="light-ring"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          v-for="index in 60"
          :key="index"
          x="492"
          y="30"
          width="16"
          height="92"
          rx="8"
          :transform="'rotate(' + (index - 1) * 6 + ' 500 500)'"
          :style="{ '--segment': index - 1 }"
        />
      </svg>
      <div class="auth-panel"><slot /></div>
    </section>
    <footer>هر فنجان، یک حال خوب</footer>
  </main>
</template>
<script setup>
defineProps({ registering: Boolean })
</script>
<style scoped>
.auth-page {
  min-height: 100svh;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at center, #10213a 0%, #070f1d 72%);
  color: #e4efff;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(100%, 1120px);
  margin: 0 auto;
}
.auth-brand {
  font-weight: bold;
  font-size: 19px;
  text-decoration: none;
}
.back-link {
  color: #a9bdd8;
  text-decoration: none;
  font-size: 13px;
}
.back-link:hover {
  color: #44b6ff;
}
.back-link span {
  display: inline-block;
  margin-right: 8px;
}
.auth-stage {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 610px);
  min-height: 540px;
  aspect-ratio: 1;
  margin: auto;
  isolation: isolate;
}
.light-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.light-ring rect {
  fill: #123354;
  animation: blue-orbit 4s linear infinite;
  animation-delay: calc(var(--segment) * 66.6667ms - 4000ms);
}
@keyframes blue-orbit {
  0%,
  10% {
    fill: #149dff;
    filter: drop-shadow(0 0 9px #0788ffb0);
  }
  20% {
    fill: #105a9f;
    filter: drop-shadow(0 0 3px #0788ff40);
  }
  32%,
  100% {
    fill: #123354;
    filter: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .light-ring rect {
    animation: none;
  }
  .light-ring rect:nth-child(n + 13):nth-child(-n + 26) {
    fill: #149dff;
  }
}
.auth-panel {
  width: 54%;
  max-width: 320px;
  padding: 52px 0;
  z-index: 1;
}
.is-register {
  width: min(100%, 690px);
  min-height: 800px;
}
.is-register .auth-panel {
  width: 55%;
}
footer {
  text-align: center;
  font-size: 12px;
  color: #93a8c4;
  margin-top: 12px;
}
@media (max-width: 550px) {
  .auth-page {
    padding: 22px 14px;
  }
  header {
    gap: 12px;
  }
  .auth-brand {
    font-size: 15px;
  }
  .back-link {
    font-size: 11px;
  }
  .auth-stage {
    min-height: 520px;
  }
  .auth-panel {
    width: 65%;
    padding: 56px 0;
  }
  .is-register {
    min-height: 800px;
  }
  .is-register .auth-panel {
    width: 60%;
  }
}
</style>
