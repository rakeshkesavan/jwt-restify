const error = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = server => {
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new error.InvalidContentError(err));
    }
  });

  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.find(req.params._id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new error.ResourceNotFoundError(
          `Ther is no cutomer with id of $(req.params.id)`
        )
      );
    }
  });

  server.post("/customers", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new error.InvalidContentError("Expects application json"));
    }
    const { name, email } = req.body;
    const customer = new Customer({
      name,
      email
    });
    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new error.InvalidContentError(err));
    }
  });

  server.put("/customers/:id", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new error.InvalidContentError("Expects application json"));
    }

    try {
      const customer = await Customer.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(new error.InvalidContentError(err));
    }
  });

  server.del("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204);
    } catch (err) {
      return next(new error.InvalidContentError(err));
    }
  });
};
