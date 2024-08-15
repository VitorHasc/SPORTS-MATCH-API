const {express, router, GroupController, app} = require('../config/configfun'); const {SECRET, jwt} = require('../config/configvar');

  router.get('/search', GroupController.encontrarGrupos);
  router.get('/meus');
  router.get('/mensagens');
  router.post('mensagens');
  router.post('/pedido');
  router.post('/confirmarPedido');
  router.post('/criar');

module.exports = router;