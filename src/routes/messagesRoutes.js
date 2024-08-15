const {express, router, MessagesController, app} = require('../config/configfun'); const {SECRET, jwt} = require('../config/configvar');

  router.get('/conversar', MessagesController.pegarConversas);
  router.post('/mensagens', MessagesController.enviarMensagem);
  router.post('/mensagenspeg', MessagesController.pegarMensagens);

module.exports = router;