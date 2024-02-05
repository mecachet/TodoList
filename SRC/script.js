$(function () {
  var Todo = Backbone.Model.extend({
    defaults: function () {
      return {
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false,
      };
    },
    toggle: function () {
      this.save({ done: !this.get("done") });
    },
  });

  var TodoList = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage("todos-backbone"),
    done: function () {
      return this.where({ done: true });
    },
    remaining: function () {
      return this.without.apply(this, this.done());
    },
    nextOrder: function () {
      if (!this.length) return 1;
      return this.last().get("order") + 1;
    },
    comparator: "order",
  });

  var Todos = new TodoList();

  var TodoView = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#item-template").html()),
    events: {
      "click .toggle": "toggleDone",
      "dblclick #view": "edit",
      "click a.destroy": "clear",
      "keypress .edit": "updateOnEnter",
      "blur .edit": "close",
    },
    initialize: function () {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass("done", this.model.get("done"));
      this.input = this.$(".edit");
      return this;
    },
    toggleDone: function () {
      this.model.toggle();
    },
    edit: function () {
      this.$el.addClass("editing");
      this.input.focus();
    },
    close: function () {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({ title: value });
        this.$el.removeClass("editing");
      }
    },
    updateOnEnter: function (e) {
      if (e.keyCode == 13) this.close();
    },
    clear: function () {
      this.model.destroy();
    },
  });

  var AppView = Backbone.View.extend({
    el: $("#todoapp"),
    statsTemplate: _.template($("#stats-template").html()),
    events: {
      "keypress #new-todo": "createOnEnter",
      "click #clear-completed": "clearCompleted",
    },
    initialize: function () {
      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, "add", this.addOne);
      this.listenTo(Todos, "reset", this.addAll);
      this.listenTo(Todos, "all", this.render);

      this.footer = this.$("footer");
      this.main = $("#main");

      Todos.fetch();
    },
    render: function () {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(
          this.statsTemplate({ done: done, remaining: remaining })
        );
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    addOne: function (todo) {
      var view = new TodoView({ model: todo });
      this.$("#todo-list").append(view.render().el);
    },
    addAll: function () {
      Todos.each(this.addOne, this);
    },
    createOnEnter: function (e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({ title: this.input.val() });
      this.input.val("");
    },
    clearCompleted: function () {
      _.invoke(Todos.done(), "destroy");
      return false;
    },
  });

  var App = new AppView();
});

// Bookmark Element

$(function () {
  var Mark = Backbone.Model.extend({
    defaults: function () {
      return {
        title: "empty bookmark...",
        order: Marks.nextOrder(),
        done: false,
      };
    },
    toggle: function () {
      this.save({ done: !this.get("done") });
    },
  });

  var Marklist = Backbone.Collection.extend({
    model: Mark,
    localStorage: new Backbone.LocalStorage("marks-backbone"),
    done: function () {
      return this.where({ done: true });
    },
    remaining: function () {
      return this.without.apply(this, this.done());
    },
    nextOrder: function () {
      if (!this.length) return 1;
      return this.last().get("order") + 1;
    },
    comparator: "order",
  });

  var Marks = new Marklist();

  var Markview = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#item-template").html()),
    events: {
      "click .toggle": "toggleDone",
      "dblclick #view": "edit",
      "click a.destroy": "clear",
      "keypress .edit": "updateOnEnter",
      "blur .edit": "close",
    },
    initialize: function () {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass("done", this.model.get("done"));
      this.input = this.$(".edit");
      return this;
    },
    toggleDone: function () {
      this.model.toggle();
    },
    edit: function () {
      this.$el.addClass("editing");
      this.input.focus();
    },
    close: function () {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({ title: value });
        this.$el.removeClass("editing");
      }
    },
    updateOnEnter: function (e) {
      if (e.keyCode == 13) this.close();
    },
    clear: function () {
      this.model.destroy();
    },
  });

  var MarkView = Backbone.View.extend({
    el: $("#bookmarkapp"),
    statsTemplate: _.template($("#stats-template").html()),
    events: {
      "keypress #new-mark": "createOnEnter",
      "click #clear-completed": "clearCompleted",
    },
    initialize: function () {
      this.input = this.$("#new-mark");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Marks, "add", this.addOne);
      this.listenTo(Marks, "reset", this.addAll);
      this.listenTo(Marks, "all", this.render);

      this.footer = this.$("footer");
      this.main = $("#main");

      Marks.fetch();
    },
    render: function () {
      var done = Marks.done().length;
      var remaining = Marks.remaining().length;

      if (Marks.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(
          this.statsTemplate({ done: done, remaining: remaining })
        );
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    addOne: function (mark) {
      var view = new Markview({ model: mark });
      this.$("#mark-list").append(view.render().el);
    },
    addAll: function () {
      Marks.each(this.addOne, this);
    },
    createOnEnter: function (e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Marks.create({ title: this.input.val() });
      this.input.val("");
    },
    clearCompleted: function () {
      _.invoke(Marks.done(), "destroy");
      return false;
    },
  });

  var MarkApp = new MarkView();
});

// Calculator 

var $keys = $('.calculator button');
var $screen = $('.screen');
var decimal = false;
var operators = ['+', '-', 'x', '÷'];

$keys.click(function() {
  var keyVal = $(this).data('val');
  output = $('.screen').html();

  console.log(keyVal);

  // clear
  if (keyVal == 'clear') {
    $screen.html('');
    decimal = false;
  }
  // equal
  else if (keyVal == '=') {
    var equation = output;
    var lastChar = equation[equation.length - 1];
    equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
    if (operators.indexOf(lastChar) > -1 || lastChar == '.')
      equation = equation.replace(/.$/, '');
    if (equation) {
      $screen.html(eval(equation));
    }
    decimal = false;
  }
  // operators
  else if ($(this).parent().is('.operators')) {
    var lastChar = output[output.length - 1];
    if (output != '' && operators.indexOf(lastChar) == -1) {
      $screen.html($screen.html() + keyVal);
    } else if (output == '' && keyVal == '-') {
      $screen.html($screen.html() + keyVal);
    }
    if (operators.indexOf(lastChar) > -1 && output.length > 1) {
      $screen.html($screen.html().replace(/.$/, keyVal));
    }
    decimal = false;
  }
  // decimal
  else if (keyVal == '.') {
    if (!decimal) {
      $screen.html($screen.html() + keyVal);
      decimal = true;
    }
  }
  // buttons
  else {
    $screen.html($screen.html() + keyVal);
  }
})

$(window).keydown(function(e) {
  console.log(e.which);
  switch (e.which) {
    case 96:
      key = 0;
      break;
    case 97:
      key = 1;
      break;
    case 98:
      key = 2;
      break;
    case 99:
      key = 3;
      break;
    case 100:
      key = 4;
      break;
    case 101:
      key = 5;
      break;
    case 102:
      key = 6;
      break;
    case 103:
      key = 7;
      break;
    case 104:
      key = 8;
      break;
    case 105:
      key = 9;
      break;
    case 111:
      key = '÷';
      break;
    case 109:
      key = '-';
      break;
    case 106:
      key = 'x';
      break;
    case 107:
      key = '+';
      break;
    case 13:
      key = '=';
      break;
    case 110:
      key = '.';
      break;
    case 27:
      key = 'clear';
      break;
    default:
      return false;
  }

  $('[data-val="' + key + '"]').addClass('active').click();

}).keyup(function(){
  $('.active').removeClass('active');
});


/*--------------------
Codepen Preview Tile
--------------------*/
$('[data-val="clear"]').click().delay(100).queue(function(){
  $('[data-val="1"]').click().delay(200).queue(function(){
    $('[data-val="5"]').click().delay(200).queue(function(){
      $('[data-val="x"]').click().delay(200).queue(function(){
        $('[data-val="3"]').click();
      });
    });
  });
})