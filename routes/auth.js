// routes/auth.js
exports.callback = function(req, res){
  // In the real application you might need to check 
  // whether the user exits and if exists redirect 
  // or if not you many need to create user.
  res.send('Login success');
};

exports.error = function(req, res){
  res.send('Login Failed');
};