export default {
  fetch(_) {
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler;
