"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Middleware: permissions

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Rol kontrolü
    if (!roles.includes(req.user.role)) {
      throw new Error("You do not have permission to perform this action");
    }

    next();
  };
};

module.exports = restrictTo;
