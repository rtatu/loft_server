const controller = require("../../controller/po");

module.exports = router => {
  router
    .route("/po")
    .get(controller.get)
    .post(controller.add)
    .put(controller.update)
    .delete(controller.remove);
};
