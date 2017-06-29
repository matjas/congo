Congo.Database = Backbone.Model.extend({

});

Congo.Databases = Backbone.Collection.extend({
  model : Congo.Database,
  url : "mongo-api/dbs"
});

Congo.DatabaseView = Backbone.View.extend({
  tagName : "tr",
  events : {
    "click a" : "sayHello",
    "click button" : "sayHello"
  },
  sayHello : function() {
    alert("Hello again!");
  },
  render : function(){
    var template = $("#database-list-template").html();
    var compiled = _.template(template, this.model.toJSON());
    $(this.el).html(compiled);
    return this;
  }
});

Congo.DatabaseListView = Backbone.View.extend({
  initialize : function () {
    this.collection.bind("reset", this.render, this);
    this.collection.bind("add", this.render, this);
    this.collection.bind("remove", this.render, this);
  },
  tagName : "table",
  className : "table table-striped",
  render : function(){
    var els = [];
    this.collection.each(function (item){
      var itemView = new Congo.DatabaseView({ model : item });
      els.push(itemView.render().el)
    });
      
    $(this.el).html(els);
    $("#database-list").html(this.el);
  }
});