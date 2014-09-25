// Generated by CoffeeScript 1.8.0
(function() {
  var Block, Main, build_tree, log2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  log2 = function(x) {
    return Math.log(x) / Math.LN2;
  };

  Block = (function() {
    function Block(src_object) {
      this.id = src_object.id;
      this.children = [];
      this.parent = null;
      this.num_faces = src_object.num_faces;
      this.num_vertices = src_object.num_vertices;
      this.min_x = src_object.min_x;
      this.min_y = src_object.min_y;
      this.min_z = src_object.min_z;
      this.max_x = src_object.max_x;
      this.max_y = src_object.max_y;
      this.max_z = src_object.max_z;
    }

    return Block;

  })();

  Main = (function() {
    Main.prototype.margin = 0.05;

    Main.prototype.colours = [0x19ff00, 0x00ff65, 0x0098ff, 0x6500ff, 0xe500ff];

    Main.prototype.last_colour = 0;

    function Main(target, tree, options) {
      this.window_resize = __bind(this.window_resize, this);
      this.render = __bind(this.render, this);
      this.animate = __bind(this.animate, this);
      var cam_pos, viewport_height, viewport_width;
      this.options = $.extend({
        swap_yz: false,
        random_colours: false,
        margins: false,
        only_leaves: false
      }, options || {});
      this.tree = tree;
      this.scene = new THREE.Scene();
      this.target = $(target);
      viewport_width = this.target.width();
      viewport_height = viewport_width < 500 ? viewport_width : 500;
      this.renderer = new THREE.WebGLRenderer({
        antialiasing: false
      });
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.setSize(viewport_width, viewport_height);
      cam_pos = this.build_scene();
      this.camera = new THREE.PerspectiveCamera(55, viewport_width / viewport_height, 0.1, 10000);
      this.camera.position.x = cam_pos[0];
      this.camera.position.y = cam_pos[1];
      this.camera.position.z = cam_pos[2];
      this.camera.up = new THREE.Vector3(0, 0, 1);
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.damping = 0.2;
      this.controls.addEventListener('change', this.render);
      this.target.append(this.renderer.domElement);
      window.addEventListener('resize', this.window_resize, false);
      this.fill_stats();
      this.animate();
      this.render();
    }

    Main.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.controls.update();
    };

    Main.prototype.render = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    Main.prototype.window_resize = function() {
      var viewport_height, viewport_width;
      viewport_width = this.target.width();
      viewport_height = viewport_width < 500 ? viewport_width : 500;
      this.camera.aspect = viewport_width / viewport_height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(viewport_width, viewport_height);
      return this.render();
    };

    Main.prototype.build_scene = function() {
      var f, fd, fh, fw, gradient, root;
      gradient = [0xE50400, 0xE10056, 0xDD00AE, 0xAF00D9, 0x5500D5, 0x0001D2, 0x0055CE, 0x00A5CA, 0x00C699, 0x00C247, 0x07BF00];
      f = (function(_this) {
        return function(node, depth) {
          var a, b, c, colour, d, ex, ey, ez, margin, sx, sy, sz, _i, _len, _ref, _results;
          if ((!_this.options.only_leaves) || node.children.length === 0) {
            margin = _this.options.margins ? depth : 0;
            sx = node.min_x + margin;
            sy = node.min_y + margin;
            sz = node.min_z + margin;
            ex = node.max_x - margin;
            ey = node.max_y - margin;
            ez = node.max_z - margin;
            if (_this.options.swap_yz) {
              a = -ez;
              b = -sz;
              c = sy;
              d = ey;
              sy = a;
              sz = c;
              ey = b;
              ez = d;
            }
            colour = _this.options.random_colours ? _this.next_colour() : gradient[depth];
            _this.add_block_by_bounds(sx, sy, sz, ex, ey, ez, colour);
          }
          _ref = node.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            _results.push(f(c, depth + 1));
          }
          return _results;
        };
      })(this);
      if (this.tree !== null) {
        root = this.tree;
        fw = root.max_x - root.min_x;
        fh = root.max_y - root.min_y;
        fd = root.max_z - root.min_z;
        f(root, 0);
        return [fw, fh, fd];
      }
      return [1, 1, 1];
    };

    Main.prototype.next_colour = function() {
      this.last_colour = (this.last_colour + 1) % this.colours.length;
      return this.colours[this.last_colour];
    };

    Main.prototype.add_block = function(x, y, z, w, h, d, color) {
      var g1, g2, material, rcol, side1, side2, tmp;
      tmp = new THREE.BoxGeometry(w, h, d);
      rcol = color || this.next_colour();
      material = new THREE.LineBasicMaterial({
        color: rcol
      });
      g1 = new THREE.Geometry();
      g1.vertices.push(tmp.vertices[1]);
      g1.vertices.push(tmp.vertices[4]);
      g1.vertices.push(tmp.vertices[6]);
      g1.vertices.push(tmp.vertices[3]);
      g1.vertices.push(tmp.vertices[2]);
      g1.vertices.push(tmp.vertices[0]);
      g1.vertices.push(tmp.vertices[1]);
      g1.vertices.push(tmp.vertices[3]);
      side1 = new THREE.Line(g1, material);
      side1.position.set(x, y, z);
      this.scene.add(side1);
      g2 = new THREE.Geometry();
      g2.vertices.push(tmp.vertices[5]);
      g2.vertices.push(tmp.vertices[7]);
      g2.vertices.push(tmp.vertices[2]);
      g2.vertices.push(tmp.vertices[0]);
      g2.vertices.push(tmp.vertices[5]);
      g2.vertices.push(tmp.vertices[4]);
      g2.vertices.push(tmp.vertices[6]);
      g2.vertices.push(tmp.vertices[7]);
      side2 = new THREE.Line(g2, material);
      side2.position.set(x, y, z);
      return this.scene.add(side2);
    };

    Main.prototype.add_block_by_bounds = function(sx, sy, sz, ex, ey, ez, colour) {
      return this.add_block((sx + ex) / 2, (sy + ey) / 2, (sz + ez) / 2, ex - sx, ey - sy, ez - sz, colour);
    };

    Main.prototype.fill_stats = function() {
      var add_stat, count, f, largest_leaf_size, leaves, levels, smallest_leaf_size, target;
      target = $('#stats_target');
      count = 0;
      leaves = 0;
      levels = 0;
      smallest_leaf_size = 99999999999;
      largest_leaf_size = 0;
      f = (function(_this) {
        return function(n, depth) {
          var c, _i, _len, _ref, _results;
          count += 1;
          if (n.children.length > 0) {
            _ref = n.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              c = _ref[_i];
              _results.push(f(c, depth + 1));
            }
            return _results;
          } else {
            leaves += 1;
            if (depth > levels) {
              levels = depth;
            }
            if (n.num_faces < smallest_leaf_size) {
              smallest_leaf_size = n.num_faces;
            }
            if (n.num_faces > largest_leaf_size) {
              return largest_leaf_size = n.num_faces;
            }
          }
        };
      })(this);
      f(this.tree, 1);
      add_stat = (function(_this) {
        return function(name, value) {
          var row;
          row = $('<tr></tr>');
          row.append($('<td></td>').html(name));
          row.append($('<td></td>').html(value));
          return target.append(row);
        };
      })(this);
      add_stat('Nodes', count);
      add_stat('Leaf Nodes', leaves);
      add_stat('Depth', levels);
      add_stat('Biggest leaf (#faces)', largest_leaf_size);
      return add_stat('Smallest leaf (#faces)', smallest_leaf_size);
    };

    return Main;

  })();

  build_tree = function(obj_array) {
    var blocks, o, p, root, t, _i, _j, _len, _len1;
    root = null;
    blocks = {};
    for (_i = 0, _len = obj_array.length; _i < _len; _i++) {
      o = obj_array[_i];
      blocks[o.id] = new Block(o);
    }
    for (_j = 0, _len1 = obj_array.length; _j < _len1; _j++) {
      o = obj_array[_j];
      t = blocks[o.id];
      if (o.parent_id === null) {
        root = t;
      } else {
        p = blocks[o.parent_id];
        p.children.push(t);
        t.parent = p;
      }
    }
    return root;
  };

  $(function() {
    $('#button1').click(function() {
      var main, o, t, tree;
      o = JSON.parse($('#textarea1')[0].value);
      tree = build_tree(o);
      t = $('#canvas_target')[0];
      $('.interface_2_row').css('display', 'block');
      main = new Main(t, tree, {
        swap_yz: ($('#checkbox1')[0]).checked,
        random_colours: ($('#checkbox2')[0]).checked,
        margins: ($('#checkbox3')[0]).checked,
        only_leaves: ($('#checkbox4')[0]).checked
      });
      return $('#interface1').remove();
    });
    return $('#button2').click(function() {
      return $.ajax('sample.json', {
        type: 'GET',
        dataType: 'text',
        success: function(data, textStatus, jqXHR) {
          return $('#textarea1')[0].value = data;
        }
      });
    });
  });

}).call(this);
