<template>
  <q-layout view="hHh lpR fFf" class="cafe-bg">
    <q-header elevated class="cafe-header">
      <q-toolbar class="page-width">
        <q-toolbar-title class="text-weight-bold"> ☕ کافه آرامش </q-toolbar-title>

        <q-btn
          flat
          round
          icon="menu"
          aria-label="باز کردن منو"
          class="lt-md"
          @click="drawer = !drawer"
        />

        <div class="gt-sm row q-gutter-xs">
          <q-btn flat label="خانه" to="/" />
          <q-btn flat label="منو" to="/menu" />
          <q-btn flat label="میزها" to="/tables" />
          <q-btn flat label="رزرو میز" to="/reservation" />
          <q-btn flat label="رزروهای من" to="/my-reservations" />
          <template v-if="auth.isAuthenticated">
            <span class="self-center q-px-sm">{{ auth.user.name }}</span>
            <q-btn flat label="خروج" :loading="loggingOut" @click="logout" />
          </template>
          <q-btn v-else flat label="ورود / ثبت‌نام" to="/login" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" bordered class="cafe-drawer lt-md">
      <q-list padding>
        <q-item clickable v-ripple to="/" @click="drawer = false">
          <q-item-section>خانه</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/menu" @click="drawer = false">
          <q-item-section>منو</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/tables" @click="drawer = false">
          <q-item-section>میزها</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/reservation" @click="drawer = false">
          <q-item-section>رزرو میز</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/my-reservations" @click="drawer = false">
          <q-item-section>رزروهای من</q-item-section>
        </q-item>
        <q-item v-if="!auth.isAuthenticated" clickable to="/login" @click="drawer = false"
          ><q-item-section>ورود / ثبت‌نام</q-item-section></q-item
        >
        <q-item v-else clickable :disable="loggingOut" @click="logout"
          ><q-item-section>خروج از حساب {{ auth.user.name }}</q-item-section></q-item
        >
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-linear-progress v-if="bookingStore.loading" indeterminate color="blue" />
      <q-banner v-if="bookingStore.error" class="bg-red-1 text-red-9" role="alert">
        {{ bookingStore.error }}
        <template #action>
          <q-btn
            flat
            label="تلاش دوباره"
            :loading="bookingStore.loading"
            @click="bookingStore.initialize"
          />
        </template>
      </q-banner>
      <slot />
    </q-page-container>

    <q-footer class="cafe-header q-pa-md text-center">
      کافه آرامش | هر فنجان، یک حال خوب ☕
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore'
import { useBookingStore } from '../stores/bookingStore'

const auth = useAuthStore()
const bookingStore = useBookingStore()
const router = useRouter()
const $q = useQuasar()
const drawer = ref(false)
const loggingOut = ref(false)

// Every page uses this layout, so menu, tables and reservations refresh on each navigation.
onMounted(() => bookingStore.initialize())

async function logout() {
  loggingOut.value = true
  try {
    if (bookingStore.temporaryLock) await bookingStore.releaseSelectedTable()
    await auth.logout()
    bookingStore.clearPrivateData()
    drawer.value = false
    await router.push('/login')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  } finally {
    loggingOut.value = false
  }
}
</script>
