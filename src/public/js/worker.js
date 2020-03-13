console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.text();
  console.log(e.data);
  self.registration.showNotification(data, {
    body: "Notified by Me!",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  });
});
