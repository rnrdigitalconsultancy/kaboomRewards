product = {
	ini:function(){
		this.add();
		this.list();
	},
	get:function(){
		var data = system.html('assets/harmony/Process.php?get-products');
		return data.responseText;
	},
	list:function(){
		var content = "";
		var data = product.get();
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			content += "<tr>"+
						"	<td width='1px'>"+(i+1)+". </td>"+
						"	<td><img src='../assets/images/img3.jpg' alt='Thumbnail' class='responsive-img valign profile-image' width='100px'></td>"+
						"	<td width='300px'>"+v[1]+"</td>"+
						"	<td>"+v[5]+"</td>"+
						"	<td>"+v[4]+"</td>"+
						"	<td>"+v[2]+"</td>"+
						"	<td>"+v[3]+"</td>"+
						"	<td>published</td>"+
						"	<td width='1px'>"+
						"		<a class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show' data-cmd='update'>"+
						"			<i class='mdi-navigation-more-vert right black-text'></i>"+
						"		</a>"+
						"	</td>"+
						"</tr>";
		})	

		content = "<table class='table bordered' id='products'>"+
					"<thead>"+
					"	<tr>"+
					"		<th>#</th><th>Thumbnail</th><th>Product</th><th>Description</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th><th></th>"+
					"	</tr>"+
					"</thead>"+
					"</tbody>"+
						content+
					"</tbody>"+
					"</table>";
		$("#display_productList").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	listGrid:function(){
		var data = system.xml("pages.xml");
		var _content = "";
		$(data.responseText).find("product").each(function(i,content){
			for(x=0;x<=100;x++){
				_content += content.innerHTML;

			}
			$("#products").html(_content);
		});
	},
	add:function(){
		$("#add_product").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addProduct").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').openModal('show');

				$("#form_addProduct").validate({
				    rules: {
				        field_productName: {required: true,maxlength: 50},
				        field_qty: {required: true,maxlength: 50,checkPositiveNumber:true},
				        field_price: {required: true,maxlength: 50,checkCurrency:true},
				        field_description: {required: true,maxlength: 900},
				        field_category: {required: true,maxlength: 500},
				    },
				    errorElement : 'div',
				    errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?set-newProductAdmin',_form);
						data.done(function(data){
							if(data == 1){
								Materialize.toast('Saved.',4000);
								system.clearForm();
								App.handleLoadPage("#cmd=index;content=list_products");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				});
			});
		})
	},
}

market = {
	ini:function(){
		this.products();
		$("body").append("<script>console.log('%cDeveloped By: RNR Digital Consultancy (2017) http://rnrdigitalconsultancy.com ,,|,_', 'background:#f74356;color:#64c2ec;font-size:20px;')</script>");
		$(document).ready(function(){
		    $('.tooltipped').tooltip({delay: 1});
		});
		setTimeout(function(){
			system.loading(true);
			$('#content-login').addClass('animated slideInUp');
		},1000);

		var data = system.ajax('assets/harmony/Process.php?chkUserLogin',"");
		data.done(function(data){
			if(data == 0){
			}
			else{
		    	$("#display_cart").removeClass("bounceOutUp");
		    	$("#display_login").addClass("bounceOutUp");
		    	$("#display_cart").addClass("bounceInUp");
		    	$("#display_login").parent().addClass('hidden');
				profile.ini();
			}
		});
	},
	products:function(){
		var content = "",search = [], disabled = "";
		var data = product.get();
		var cart = market.getCart();

		data = JSON.parse(data);
		$.each(data,function(i,v){
			search = system.searchJSON(cart,0,v[0]);
			if(search.length>0)
				disabled = "disabled";
			else
				disabled = "";
			content += "<div class='product col s6 m3 l3' style='margin-bottom:30px;'>"+
						"    <div class='card'>"+
						"        <div class='card-image waves-effect waves-block waves-light'>"+
						"            <img class='activator' draggable='false' src='assets/images/products/"+v[10]+"' alt='product-img'>"+
						"        </div>"+
						"        <ul class='card-action-buttons'>"+
						"            <li>"+
						"				<button class= btn-floating waves-effect black-text blue' "+disabled+" data-cmd='addCart' data-node='"+v[0]+"' data-price='"+v[3]+"' data-qty='"+v[2]+"'>"+
						"					<i class='mdi-action-shopping-cart'></i>"+
						"				</button>"+
						"			</li>"+
						"        </ul>"+
						"        <div class='card-content'>"+
						"            <div class='row'>"+
						"                <div class='col s8'>"+
						"                    <p class='card-title grey-text text-darken-4'><a href='#' class='grey-text text-darken-4'>"+v[1]+"</a></p>"+
						"                </div>"+
						"                <div class='col s4'>"+
						"                    <p class='right' style='font-size: 24px;line-height: 32px;'>"+v[3]+"</p>"+
						"                </div>"+
						"            </div>"+
						"        </div>"+
						"        <div class='card-reveal'>"+
						"            <span class='card-title grey-text text-darken-4'><i class='mdi-navigation-close right'></i> "+v[1]+"</span>"+
						"            <p>"+v[5]+"</p>"+
						"        </div>"+
						"    </div>"+
						"</div>";
		});
		$("#products").html(content);

		$("button[data-cmd='addCart']").on('click',function(){
			var data = [$(this).data('node'),Number($(this).data('price')),Number($(this).data('qty'))];
			var points = Number(localStorage.getItem('points'));
			if(points>data[1]){
				$( ".tooltipped" ).tooltip({
				  hide: { effect: "explode", duration: 1000 }
				})
				$(this).attr({"disabled":"true"});
				$(this).removeClass("tooltipped");
				market.addToCart(points,data);
			}
			else{
				Materialize.toast('Insufficient points',4000);
			}
		});
	},
	addProduct:function(points,data){
		var currentCount = ((localStorage.getItem('cartCount')=="") || (localStorage.getItem('cartCount')==null))?0:Number(localStorage.getItem('cartCount'));
		localStorage.setItem('cartCount',currentCount+1);
		localStorage.setItem('points',points-data[1]);
		localStorage.setItem('cart-'+currentCount,JSON.stringify(data));
	},
	addToCart:function(points,data){
		console.log(data);
		var products = product.get();
		var  cart = market.getCart();
		var total = 0;
		market.addProduct(points,data);
		products = JSON.parse(products);
		search = system.searchJSON(products,0,data[0]);
		content = "<li class='animated slideInLeft collection-item avatar'>"+
				"	<img src='assets/images/products/"+search[0][10]+"' alt='' class='circle'>"+
				"	<span class='title'>"+search[0][1]+"  <span class='grey-text'>"+search[0][3]+"pts<span><br/>"+
				"		<button data-cmd='lessQuantity' data-cost='"+search[0][3]+"' style='border-radius: 0%;' class='btn-floating btn-flat blue waves-effect waves-light white-text'><i class='mdi-content-remove white-text'></i></button>"+
				"		<input data-cmd='input' type='text' class='validate valid' value='1' style='width: 40px;height: 35px;text-align: center;'>"+
				"		<button data-cmd='addQuantity' data-limit='"+search[0][2]+"' data-cost='"+search[0][3]+"' style='border-radius: 0%;' class='btn-floating btn-flat purple darken-4 waves-effect waves-light white-text'><i class='mdi-content-add white-text'></i></button>"+
				"		<a class='secondary-content' style='font-size: 20px;'>"+search[0][3]+"</a>"+
				"	</span>"+
				"</li>";

		$.each(cart,function(i,v){
			search = system.searchJSON(products,0,v[0]);
			total = total+Number(search[0][3]);
		})
		$("#display_total span").html(total);

		$("#display_productInCart ul").append(content);
		market.options();
	},
	showCart:function(){
		console.log("xxx");
		var count = 0;
		var total = 0;
		var content = "";
		var search = [], cart = [];
		var products = product.get();
		var  cart = market.getCart();
		var points = Number(localStorage.getItem('points'));
		products = JSON.parse(products);
		$.each(cart,function(i,v){
			search = system.searchJSON(products,0,v[0]);
			total = total+Number(search[0][3]);
			content += "<li class='animated slideInLeft collection-item avatar'>"+
					"	<img src='assets/images/products/"+search[0][10]+"' alt='' class='circle'>"+
					"	<span class='title'>"+search[0][1]+"  <span class='grey-text'>"+search[0][3]+"pts<span><br/>"+
					"		<button data-cmd='lessQuantity' data-cost='"+search[0][3]+"' style='border-radius: 0%;' class='btn-floating btn-flat blue waves-effect waves-light white-text'><i class='mdi-content-remove white-text'></i></button>"+
					"		<input data-cmd='input' type='text' class='validate valid' value='1' style='width: 40px;height: 35px;text-align: center;'>"+
					"		<button data-cmd='addQuantity' data-limit='"+search[0][2]+"' data-cost='"+search[0][3]+"' style='border-radius: 0%;' class='btn-floating btn-flat purple darken-4 waves-effect waves-light white-text'><i class='mdi-content-add white-text'></i></button>"+
					"		<a class='secondary-content' style='font-size: 20px;'>"+search[0][3]+"</a>"+
					"	</span>"+
					"</li>";
		})
		$("#display_total span").html(total);
		$("#display_productInCart ul").append(content);
		$("#display_points .cart_bigNumber span").html(points+" points left");
		market.options();
	},
	options:function(){
		var points = localStorage.getItem('points');
		console.log(points);
		$("li button[data-cmd='addQuantity']").on('click',function(){
			var data = $(this).data();
			if($(this).parent().find('input').val() < data.limit){
				count = Number($(this).parent().find('input').val()) + 1;
				$(this).parent().find('input').val(count);				
				$(this).parent().find('a.secondary-content').html(count*data.cost);	
				console.log(points-(count*data.cost));
				console.log("xx");
			}
		});

		$("li button[data-cmd='lessQuantity']").on('click',function(){
			var data = $(this).data();
			if($(this).parent().find('input').val() > 1){
				count = Number($(this).parent().find('input').val()) - 1;
				$(this).parent().find('input').val(count);
				$(this).parent().find('a.secondary-content').html(count*data.cost);	
			}
		})

		$("button[data-cmd='removeCart']").on('click',function(){
			var data = [$(this).data('node'),Number($(this).data('price')),Number($(this).data('qty'))];
			var points = Number(localStorage.getItem('points'));
			if(points>data[1]){
				$( ".tooltipped" ).tooltip({
				  hide: { effect: "explode", duration: 1000 }
				})
				$(this).attr({"disabled":"true"});
				$(this).removeClass("tooltipped");
				market.addToCart(points,data);
			}
			else{
				Materialize.toast('Insufficient points',4000);
			}
		});

		$("button[data-cmd='checkOut']").on('click',function(){
			var cart = market.getCart();
			market.checkout(cart);
		});
	},
	getCart:function(){
		var data = [];
		for(x=0;x<localStorage.length;x++){
			cart = localStorage.getItem('cart-'+x);
			if(cart != null){
				data.push(JSON.parse(cart));
			}
		}
		return data;
	},
	checkout:function(data){
		var data = system.ajax('assets/harmony/Process.php?set-orders',data);
		data.done(function(data){
			if(data == 1){
				Materialize.toast('Order Placed.',4000);
				market.removeLocalStorage();
		    	window.location.reload(true);
			}
			else{
				Materialize.toast('Cannot process orders.',4000);
			}
		});
	},
	removeLocalStorage:function(){
		for(x=0;x<50;x++){
			localStorage.removeItem('cart-'+x);
		}
		localStorage.removeItem('cartCount');
		console.log(localStorage);		
	}
};

profile = {
	ini:function(){
		profile.getAccount();
		market.showCart();

        system.forceLogout(function(){
        	profile.logout();
        });
	},
	getPoints:function(id){
		var data = system.ajax('assets/harmony/Process.php?get-employeePoints',id);
		data.done(function(data){
			data = JSON.parse(data);
			localStorage.setItem('points',data[0][2]);
			$("#display_points .cart_bigNumber").html(data[0][2]+"<small> points<span style='display: block;'></span></small>");
		});
	},
	getAccount:function(){
		var content = "";
		var data = system.html('assets/harmony/Process.php?get-employeeAccount');
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length>0){
				$("#display_account p").html("<strong>"+data[0][4]+" "+data[0][5].substring(0,1)+". "+data[0][3]+"</strong>");
				profile.getPoints(data[0][0]);
			}
			else{
		    	$("#display_cart").removeClass('bounceInUp').addClass("bounceOutUp");
		    	$("#display_login").removeClass("bounceOutUp").addClass('bounceInUp');
			}

			$("a[data-cmd='logout']").on("click",function(){
	        	profile.logout();
			});

			$("a[data-cmd='account']").on("click",function(){
				localStorage.setItem("hash",'employee');
		    	$(location).attr('href','account/');
			});			
		});
	},
	logout:function(){
		var data = system.ajax('assets/harmony/Process.php?kill-session',"");
		data.done(function(data){
			if(data == 1){
				$(location)[0].reload()	
			}
		});	
	}
}