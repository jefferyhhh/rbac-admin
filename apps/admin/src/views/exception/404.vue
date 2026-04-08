<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="error-code">404</div>
    <div class="message">We couldn't find the page you're looking for.</div>
    <button class="go-back" onclick="history.back()">GO BACK</button>
    <div class="loading-dots">...</div>
  </div>
</template>

<style>
.container {
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}
.container {
  text-align: center;
}
.error-code {
  font-size: 10rem;
  font-weight: bold;
}
.message {
  font-size: 1.5rem;
}
.go-back {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.loading-dots {
  margin-top: 20px;
  font-size: 2rem;
}
</style>
