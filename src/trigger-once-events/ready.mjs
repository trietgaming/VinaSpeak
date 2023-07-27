export default {
  name: "ready",
  execute(client) {
    console.log(`logged in as ${client.user.tag}`);
  },
};
