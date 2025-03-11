<template>
    <main class="login-layout">
        <NuxtPage />
    </main>
</template>

<style scoped>
/* Styles spécifiques pour le layout de connexion */
body,
html {
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
}

.login-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-layout * {
    all: revert;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
</style>