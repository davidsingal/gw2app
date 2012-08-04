exports.index = function(req, res){
	res.render('../app/views/pages/index', { title: 'Express' });
};