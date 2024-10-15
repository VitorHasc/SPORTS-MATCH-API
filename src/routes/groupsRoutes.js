const {express, router, GroupController, app} = require('../config/configfun'); 
const {SECRET, jwt} = require('../config/configvar');

router.get('/search', GroupController.encontrarGrupos);  // Busca grupos que o usuário não participa
router.get('/meus', GroupController.meusGrupos);         // Busca grupos que o usuário participa
router.get('/mensagensGrupo', GroupController.verMensagens);  // Ver as mensagens de um grupo
router.post('/mensagensGrupo', GroupController.enviarMensagemGrupo); // Enviar uma mensagem para um grupo
router.post('/pedido', GroupController.fazerPedido);     // Enviar um pedido para entrar em um grupo
router.post('/confirmarPedido', GroupController.confirmarPedido); // Confirmar entrada de um usuário em um grupo
router.post('/criar', GroupController.criarGrupo);       // Criar um novo grupo
router.get('/pedidos', GroupController.buscarPedidos); // Puxa todos os pedidos de um grupo


module.exports = router;
