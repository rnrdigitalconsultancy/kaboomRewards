$(document).ready(function(){
	$('.tooltipped').tooltip({delay: 1});
	$('.modal').modal();
});

product = {
	ini:function(){
		this.add();
		this.list();
	},
	get:function(min,max){
		min = ((typeof min == undefined) || (min == null))?0:min;
		max = ((typeof max == undefined) || (max == null))?20:max;
		var data = system.ajax('assets/harmony/Process.php?get-availableProducts',[min,max]);
		return data.responseText;
	},
	count:function(){
		var data = system.ajax('assets/harmony/Process.php?get-countProducts',[min,max]);
		return data.responseText;
	},
	getCategory:function(){
		var data = system.html('assets/harmony/Process.php?get-category');
		return data.responseText;
	},
	getBrands:function(){
		var data = system.html('assets/harmony/Process.php?get-brands');
		return data.responseText;
	},
	getByID:function(id){
		var ret = [];
		var data = system.ajax('assets/harmony/Process.php?get-productsByID',id);
		data.done(function(data){
			ret = JSON.parse(data);
		});
		return ret[0];
	},
	getSuggestions(id){
		var ret = [];
		var data = system.ajax('assets/harmony/Process.php?get-suggestionsByID',id);
		data.done(function(data){
			ret = JSON.parse(data);
		});
		return ret;
	},
	suggestionsByProduct(id){
		var suggestions = product.getSuggestions(id);
		var bag = [], number = 0, content = "";
		var data_wishlist = wishlist.get();
		console.log(data_wishlist);
		$.each(suggestions,function(i,v){
			var search = system.searchJSON(data_wishlist,1,v[0]);
			content = `<div class='row'>
							<div class='card'>
								<div class='card-image waves-effect waves-block waves-light'><img alt='product-img' class='activator' draggable='false' src='assets/images/products/${v[10]}'></div>
								<ul class='card-action-buttons'>
									<li>
										<button class='btn-floating waves-effect shopping' data-cmd='addWishlist' data-wishlist='${v[0]}' data-node='${v[0]}'>
											<i class='mdi-action-favorite'></i>
										</button>
										<button class='btn-floating waves-effect shopping cyan' data-cmd='addCart' data-node='${v[0]}'>
											<i class='mdi-action-shopping-cart'></i>
										</button>
									</li>
								</ul>
								<div class='card-content'>
									<div class='row'>
										<div class='col s8'>
											<p class='card-title grey-text text-darken-4'><a class='grey-text text-darken-4' href='#'>${v[1]}</a></p>
										</div>
										<div class='col s4'>
											<p class='right' style='font-size: 24px;line-height: 32px;'>${v[3]}</p>
										</div>
									</div>
								</div>
								<div class='card-reveal grey darken-4'>
									<p class='card-title'><a class='white-text' href='#'>${v[1]}</a><i class='mdi-navigation-close right white-text'></i></p>
									<p class='white-text'>${v[5]}</p>
								</div>
							</div>
						</div>`;
			$(".product").append(content);

			if(search.length>0){
				$("button[data-wishlist='"+search[1]+"']").attr({"disabled":"true"});
			}
		});
	},
	listBrand:function(){
		let brands = JSON.parse(this.getBrands());
		let content = "";
		$.each(brands,function(i,v){
			hide = (i>=5)?'hide':'';
			content += `<li class='${hide}'>
                            <input value='${v[0]}' id="field_brand${i}" name="field_brand${i}" type="checkbox">
                            <label for="field_brand${i}">${v[0]} (${v[1]})</label>
                        </li>`;				
		})
		$("#display_brands").html(content);
		if(brands.length>5){
			$("#display_brands").append("<a href='#!' data-cmd='showMore_brand' class='link'>show more</a>");
		}

		$("a[data-cmd='showMore_brand']").on('click',function(){
			if($("#display_brands")[0].className=='unhidden'){
				$("#display_brands").removeClass('unhidden');
				$("#display_brands li.unhide").addClass('hide').removeClass('unhide');
			}
			else{
				$("#display_brands").addClass('unhidden');
				$("#display_brands li.hide").addClass('unhide').removeClass('hide');
			}
		})
	},
	listCateogry:function(){
		let category = JSON.parse(this.getCategory());
		let content = "";
		let hide = '';
		$.each(category,function(i,v){
			hide = (i>=5)?'hide':'';
			content += `<li class='${hide}'>
	                            <input value='${v[0]}' id="field_category${i}" name="field_category${i}" type="checkbox">
	                            <label for="field_category${i}">${v[0]} (${v[1]})</label>
	                        </li>`;				
		});
		$("#display_categories").html(content);
		if(category.length>5){
			$("#display_categories").append("<a href='#!' data-cmd='showMore_category' class='link'>show more</a>");
		}

		$("a[data-cmd='showMore_category']").on('click',function(){
			if($("#display_categories")[0].className=='unhidden'){
				$("#display_categories").removeClass('unhidden');
				$("#display_categories li.unhide").addClass('hide').removeClass('unhide');
			}
			else{
				$("#display_categories").addClass('unhidden');
				$("#display_categories li.hide").addClass('unhide').removeClass('hide');
			}
		});
	},
	list:function(){
		var content = "";
		var data = product.get();
		data = JSON.parse(data.responseText);
		$.each(data,function(i,v){
			content += `<tr>
							<td width='1px'>${(i+1)}. </td>
							<td><img src='../assets/images/img3.jpg' alt='Thumbnail' class='responsive-img valign profile-image' width='100px'></td>
							<td width='300px'>${v[1]}</td>
							<td>${v[5]}</td>
							<td>${v[4]}</td>
							<td>${v[2]}</td>
							<td>${v[3]}</td>
							<td>published</td>
							<td width='1px'>
								<a class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show' data-cmd='update'>
									<i class='material-icons right black-text'>more_vert</i>
								</a>
							</td>
						</tr>`;
		})	

		content = `<table class='table bordered' id='products'>
						<thead>
							<tr>
								<th>#</th><th>Thumbnail</th><th>Product</th><th>Description</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th><th></th>
							</tr>
						</thead>
						</tbody>${content}</tbody>
					</table>`;
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
};

market = {
	ini:function(){
		$("body").append("<script>console.log('%cDeveloped By: RNR Digital Consultancy (2017) http://rnrdigitalconsultancy.com ,,|,_', 'background:#f74356;color:#64c2ec;font-size:20px;')</script>");
		var data = system.ajax('assets/harmony/Process.php?chkUserLogin',"");
		data.done(function(data){
			if(data == 0){
				$("button.shopping").attr({'disabled':"true"});
			}
			else{
				$("#display_cartTotal").html(cart.get().length);
				setTimeout(function(){
					system.loading(true);
					$('#content-login').addClass('animated slideInUp');
				},1000);

				$("button.shopping").removeAttr('disabled');
				$("a[data-activates='signIn']").addClass("hidden");
				$("a[data-activates='account']").removeClass("hidden");
				$("#display_headerAccount").removeClass("hide");
				profile.ini();
				wishlist.ini();
				market.products();
				cart.count();

				let count = 21;
				let prod = '';
				$("a[data-cmd='showMore_products']").on('click',function(){
					prod = product.get(count,count+20);
					market.products(JSON.parse(prod));
					count = count + 20;
				});
			}
		});	
	},
	products:function(list){
		let content = "",search = [], disabled = "", category = "", categoryList = "", imageList = "";
		let cartList = cart.get();

		let account = profile.get();
		let id = profile.get()[0][0];
		let wishItems = wishlist.get(id);
		list = ((list == "") || (list == null))?JSON.parse(product.get()):list;

		$.each(list,function(i,v){
			search = system.searchJSON(cartList,0,v[0]);
			disabled = (search.length>0)?"disabled":disabled = "";

			console.log(disabled);
			imageList = JSON.stringify([v[10],v[11],v[12],v[13]]);
			content += `<div class='col l4 m6 s12'>
							<div class="card">
						        <div class="card-image waves-effect waves-block waves-light">
						            <img class="activator" src='assets/images/products/${v[10]}'>
						            <span class='halfway-fab'>
										<button class='btn-floating waves-effect waves-light shopping white z-depth-0 transparent' data-cmd='addWishlist' data-wishlist='${v[0]}' data-node='${v[0]}'><i class='material-icons grey-text'>favorite</i></button>
										<button class='btn-floating waves-effect waves-light shopping cyan' data-cmd='addCart' ${disabled} data-price='${v[3]}' data-product='${v[1]}' data-description='${v[5]}' data-node='${v[0]}' data-images='${imageList}'><i class='material-icons'>shopping_cart</i></button>
						            </span>
						        </div>
						        <div class="card-content">
									<div class='truncate' style='height:30px; overflow:hidden;'>${v[1]}</div>
									<div class='bold' style="font-size:20px;">K ${v[3]}</div>
						        </div>
						    </div>
						</div>`;				
		});

		$("#products").append(content);

		$(".product").on('click',function(e){
			$(this).galleryExpand('open');
		})

		wishlist.disableButton(id);
		$("button[data-cmd='addWishlist']").on('click',function(){
			$(this).attr({"disabled":true}).addClass('white');
			$(this).children('i').removeClass('grey-text').addClass('pink-text');
			let data = $(this).data();
			wishlist.save(id,data.node);
		});

		$("button[data-cmd='addCart']").on('click',function(){
			let data = $(this).data(), imagesList = "";

			for(let img of data.images){
				if(img != "default.png"){
					imagesList += `
	                    <li class=''><img class='' width='100%' src='assets/images/products/${img}'></li>
					`;
				}
			}

			let content = `
                <div class='col s12 m5 l5'>
                    <div class='display_mainProductImage'>
                        <img class='materialboxed' width='100%' src='assets/images/products/${data.images[0]}'>
                    </div>
                    <div class='display_listProductImages'>
                        <ul>${imagesList}</ul>
                    </div>
                </div>
                <div class='col s12 m7 l7'>
                    <h5>${data.product}</h5>
                    <h5 class="bold pink-text">K ${data.price}</h5>
                    <p>${data.description}</p>
                    <div>
						<button class='btn btn-flat waves-effect waves-light shopping cyan round white-text' id='addCart' data-price='${data.price}' data-node='${data.node}'><i class='material-icons right'>shopping_cart</i> Add to cart</button>
                    </div>
                </div>
			`;
			$('#display_product').html(content);
			$('.materialboxed').materialbox();
			$(".display_listProductImages ul li:nth-child(1)").addClass('active');
			$('#modal_cart').modal('open');

			$(".display_listProductImages ul li").on('click',function(){
				$(".display_listProductImages ul li").removeClass('active');
				let dom = $(this);
				let imgSource = $(dom.html()).attr('src');
				dom.attr({'class':'active'});
				$(".display_mainProductImage img").attr({"src":imgSource});
			})

			$("#addCart").on('click',function(){
				let data = $(this).data();
				let cartCount = cart.count();

				if(profile.getPoints() >= data.price){
					$(this).removeClass('cyan').addClass('grey darken-4').attr({"disabled":true});
					$("#display_cartTotal").html((cartCount*1)+1);
					localStorage.setItem(`cartCount`,((cartCount*1)+1));
					localStorage.setItem(`cart-${((cartCount*1)+1)}`,JSON.stringify([data.node,1]));
					Materialize.toast('Thanks! You added 1 product to your cart.',4000);
				}
				else{
					Materialize.toast('Insufficient points.',4000);
				}
			});
		});
	},
	getFilterField:function(){
		let a = document.getElementById('price-slider');
		let search = $("#field_searchProduct").val();
		let sort = $("#field_sortProduct").val();
		let checkedbrands = $("#display_brands input");
		let brands = [''];
		let checkedcategories = $("#display_categories input");
		let categories = [''];

		$.each(checkedbrands,function(i,v){
			if(v.checked){
				brands.push(v.value);
			}
		});

		$.each(checkedcategories,function(i,v){
			if(v.checked){
				categories.push(v.value);
			}
		});
		return [a.noUiSlider.get(),search,sort,brands,categories];
	},
	sort:function(){
		let priceRange = market.minMaxPricedProducts();
		priceRange = JSON.parse(priceRange);

		let price = document.getElementById('price-slider');
		noUiSlider.create(price,{
			start: priceRange,
			connect: true,
			step: 1,
			margin: (Number(priceRange[1])*0.10),
			orientation: 'horizontal',
			range: {
				'min': 0,
				'max': Number(priceRange[1])
			},
		});

		market.sortUpdatePriceRange(price);
		price.noUiSlider.on('slide', function(){
			market.sortUpdatePriceRange(price);
		});

		price.noUiSlider.on('change', function(){
			var priceRange = price.noUiSlider.get();
			var data = system.ajax('assets/harmony/Process.php?get-pricedProducts',priceRange);
			data.done(function(data){
				data = JSON.parse(data);
				if(data.length > 0){
					market.products(data);
				}
				else{
					$("#products").html("<h4 class='center grey-text'>Search yield no result</h4>");
				}
			});				
		});
	},
	filter:function(){
		product.listBrand();
		product.listCateogry();
		let priceRange = market.minMaxPricedProducts();
		let price = document.getElementById('price-slider');
		priceRange = JSON.parse(priceRange);

		noUiSlider.create(price,{
			start: priceRange,
			connect: true,
			step: 1,
			margin: (Number(priceRange[1])*0.10),
			orientation: 'horizontal',
			range: {
				'min': 0,
				'max': Number(priceRange[1])
			},
		});

		market.sortUpdatePriceRange(price);
		price.noUiSlider.on('slide', function(){
			market.sortUpdatePriceRange(price);
		});

		price.noUiSlider.on('change', function(){
			market.fetchFilter();
		});

		$("#field_sortProduct").on("change",function(){
			market.fetchFilter();
		});

		$("#field_searchProduct").on('keyup',function(){
			var search = $(this).val();
			if(search != ''){
				market.fetchFilter();
			}
			else{
				market.products();
			}
		});

		$("#display_categories input, #display_brands input").on('click',function(){
			market.fetchFilter();
		});
	},
	fetchFilter:function(){
		let data = system.ajax('assets/harmony/Process.php?get-filteredProducts',market.getFilterField());
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length > 0){
				market.products(data);
			}
			else{
				$("#products").html("<h4 class='center grey-text'>Search yield no result</h4>");
			}
		});
	},
	sortUpdatePriceRange:function(price){
		var priceRange = price.noUiSlider.get();
		$("#price-min").html(priceRange[0]);
		$("#price-max").html(priceRange[1]);
	},
	minMaxPricedProducts:function(){
		var data = system.html('assets/harmony/Process.php?get-minMaxPricedProducts');
		return data.responseText;
	},
};

cart = {
	ini:function(){
		this.showCart();
		this.shippingAddress();
		profile.getAccountCart();

		let total = 0;
		$.each($("input[data-cmd='input']"),function(i,v){
			total = total + ((v.value*1)*(v.dataset.cost*1));
		});

		cart.check(total);
	},
	count:function(){
		let cartList = 0;
		if((localStorage.getItem('cartCount') == null) || (typeof localStorage.getItem('cartCount') == undefined)){
			localStorage.setItem('cartCount',0);
		}
		else{
			cartList= localStorage.getItem('cartCount');
		}
		return cartList;
	},	
	get:function(){
		let data = [];
		let cartList;
		let count = localStorage.getItem('cartCount');
		for(x=1;x<=count;x++){
			cartList = localStorage.getItem('cart-'+x);
			if(cartList != null){
				data.push(["cart-"+x,JSON.parse(cartList)]);
			}
		}
		return data;
	},
	check:function(total){
		let points = profile.getPoints();
		if(total>points)
			$("button[data-cmd='checkOut']").attr({'disabled':true});
		else
			$("button[data-cmd='checkOut']").removeAttr('disabled');

		return total;
	},
	checkout:function(data){
		var data = system.ajax('assets/harmony/Process.php?set-orders',data);
		data.done(function(data){
			if(data == 1){
				Materialize.toast('Order Placed.',4000);
				cart.removeProduct();
				window.location.reload(true);
			} 
			else if(data == 2){
				Materialize.toast('Insufficient points.',4000);
			}
			else{
				Materialize.toast('Cannot process orders. Try some other time.',4000);
			}
		});
	},
	removeProduct:function(){
		for(x=0;x<50;x++){
			localStorage.removeItem('cart-'+x);
		}
		localStorage.removeItem('cartCount');
	},
	addToCart:function(data){
		var currentCount = ((localStorage.getItem('cartCount')=="") || (localStorage.getItem('cartCount')==null))?0:Number(localStorage.getItem('cartCount'));
		localStorage.setItem('cartCount',currentCount+1);
		localStorage.setItem('cart-'+currentCount,JSON.stringify(data));
	},
	showCart:function(){
		let count = 0;
		let total = 0, subtotal = 0;
		let content = "";
		let search = [];
		let cartList = cart.get(), _cart = "";
		let account = profile.get();
		let id = profile.get()[0][0];
		let products = JSON.parse(product.get(0,'all'));

		if(cartList.length > 0){
			$.each(cartList,function(i,v){
				search = system.searchJSON(products,0,v[1][0]);
				if(search.length>0){
					total = ((search[0][3]*1)*(v[1][1]*1));
					subtotal = subtotal + total;
					content += `<tr class='animated'>
									<td>
										<img src='assets/images/products/${search[0][10]}' alt='' style='width: 100px;' />
									</td>
									<td>
										<span class='title'>
										<div style='font-size:20px; height:30px; overflow:hidden;'>${search[0][1]}</div>
										<span class='grey-text'>${search[0][3]}pts</span><br/><br/>
										<button data-cmd='removeCart' data-cart='${v[0]}' class='btn-floating btn-flat tiny grey lighten-4'><i class='material-icons right hover black-text'>close</i></button> remove
									</td>
									<td>
										<input data-cmd='input' data-cart='${v[0]}' data-limit='${search[0][2]}' data-cost='${search[0][3]}' value='${v[1][1]}' type='number' pattern='[1-9]*' class='validate valid' style='width: 40px;height: 35px;text-align: center;'/>
									</td>
									<td style='text-align:right;'>	
										<div class='row'>
											<div class='col s12'>
												<p class='count' style='font-size: 20px;'>${total}</p>
											</div>
										</div>
									</td>
								</tr>`;
				}
			});
			$("#display_productInCart table tbody").html(content);
			$("#display_total span").html(subtotal);
			cart.options();
			cart.check(cartList);
			$("button[data-cmd='checkOut']").removeAttr('disabled');
		}
		else{
			$("button[data-cmd='checkOut']").attr({'disabled':true});
			$("#display_productInCart").html(`<div class='row'><h5 class='center grey-text'>You dont have any products.</h5></div>`);
		}
	},
	options:function(){
		let points = profile.getPoints();
		$("input[data-cmd='input']").on('input',function(){
			let total = 0;
			let data = $(this).data();
			let count = Number($(this).val());
			let cartList = JSON.parse(localStorage.getItem(data.cart));
			if(($(this).val() < data.limit) && ($(this).val()>0)){
				total = cart.subtotalCart();

				cartList = JSON.stringify([cartList[0],Number($(this).val())]);
				localStorage.setItem(data.cart,cartList);
				$(this).parent().parent().find('.count').html(count*data.cost);
				cart.check(total);
				$("#display_total span").html(total);
			}
			else{
				$(this).val(cartList[1]);
				Materialize.toast('Quantity is invalid',4000);
			}
		});

		$("button[data-cmd='removeCart']").on('click',function(){
			let total = 0;
			let _this = this;
			$(_this).parents('tr').addClass('fadeOutUpBig');
			setTimeout(function(){
				let data = $(_this).data();
				$(_this).parents('tr').remove();
				total = cart.subtotalCart();
				$("#display_total span").html(total);
				cart.check(total);
				localStorage.removeItem(data.cart);
				Materialize.toast('Product has been removed.',4000);
				$("#display_cartTotal").html(cart.get().length);
			},100);
		});

		$("button[data-cmd='checkOut']").on('click',function(){
			let cartList = cart.get();
			let total = 0;
			let address = ($("#field_address")[0].checked)?$("#input_shippingAddress").val():profile.get()[0][11];
			total = cart.subtotalCart();

			if(address == ""){
				Materialize.toast('Shipping address is required.',4000);
			}
			else{
				if(profile.getPoints() < total){
					Materialize.toast('Insufficient points.',4000);
				}
				else{
					Materialize.toast('Proceed',4000);
					cart.checkout([cartList,address]);
				}				
			}
		});
	},
	shippingAddress:function(){
		$("#field_address").on('click',function(){
			let shipping = $(this)[0].checked;
			(shipping)?$('#display_differentAddress').removeClass('hidden'):$('#display_differentAddress').addClass('hidden');
		})
	},
	subtotalCart:function(){
		let total = 0;
		$.each($("input[data-cmd='input']"),function(i,v){
			total = total + ((v.value*1)*(v.dataset.cost*1));
		});
		return total;
	},
};

profile = {
	ini:function(){
		profile.getAccount();
		system.forceLogout(function(){
			profile.logout();
		});
	},
	check:function(){
		let retData;
		let data = system.ajax('assets/harmony/Process.php?chkUserLogin',"");
		data.done(function(data){
			retData = data;
		});
		return retData;
	},
	get:function(){
		let ret = [];
		let data = system.html('assets/harmony/Process.php?get-employeeAccount');
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length <= 0){
				// $(location).attr('href','index.html');
			}
			else{
				ret = data;		
			}
		});
		return ret;
	},
	getPoints:function(){
		let id = profile.get()[0][0];
		let data = system.ajax('assets/harmony/Process.php?get-employeePoints',id);
		data = JSON.parse(data.responseText);

		return data[0][2];
	},
	displayPoints:function(){
		let points = profile.getPoints();
		$("#display_points .cart_bigNumber").html(`${points}<small> points<span style='display: block;'></span></small>`);
		$(".display_points").html(points);
	},
	getAccount:function(){
		let content = "";
		let data = this.get();
		if(data.length>0){
			$("#display_logo").attr({"style":"width:200px;"});
			$("#display_headerAccount").removeClass('hide');
			let content = `<div class="col s12 m12 l12">
								<div class="center">
									<img src="assets/images/company/logoClient.png" draggable='false' alt="" class="responsive-img valign profile-image">
								</div>
								<h5><strong>Hello <span class='pink-text'>${data[0][4]} ${data[0][5].substring(0,1)}. ${data[0][3]}</span></strong></h5>
								<p>
									<i class='material-icons left white-text'>work</i> ${data[0][13]}<br/>
									<i class='material-icons left white-text'>place</i> ${data[0][11]}
								</p>
							</div>`;

			$("#display_account").html(content);
			$(".display_accountName").html(`Hello, ${data[0][4]} ${data[0][5].substring(0,1)}. ${data[0][3]}`);
			profile.displayPoints(data[0][0]);
		}
		else{
			$("#display_cart").removeClass('bounceInUp').addClass("bounceOutUp");
			$("#display_login").removeClass("bounceOutUp").addClass('bounceInUp');
		}

		$("a[data-cmd='logout']").on("click",function(){
			profile.logout();
		});
	},
	getAccountCart:function(){
		let data = this.get();
		let points = this.getPoints();

		let content = `
					<tr>
						<td class="bold" width='80px'>Name: </td>
						<td>${data[0][4]} ${data[0][5]} ${data[0][3]} </td>
					</tr>
					<tr>
						<td class="bold">Position: </td>
						<td>${data[0][13]}</td>
					</tr>
					<tr>
						<td class="bold">Points: </td>
						<td>${points}</td>
					</tr>
					<tr>
						<td class="bold">Address: </td>
						<td>${data[0][11]}</td>
					</tr>
		`;
		$("#display_accountCart").html(content);
	},
	logout:function(){
		let data = system.ajax('assets/harmony/Process.php?kill-session',"");
		data.done(function(data){
			if(data == 1){
				$(location)[0].reload()	
			}
		});	
	}
};

wishlist = {
	ini:function(){
		var id = profile.get()[0][0];
		this.get(id);
		this.disableButton(id);
	},
	get:function(id){
		var ret = [];
		var data = system.ajax('assets/harmony/Process.php?get-wishlist',id);
		data.done(function(data){
			ret = JSON.parse(data);
		});
		return ret;
	},
	save:function(employee,product){
		var data = system.ajax('assets/harmony/Process.php?set-wishlist',[employee,product]);
		data.done(function(data){
			if(data == 1){
				Materialize.toast('Success. This product has been added to your wishlist.',4000);
			} 
			else{
				Materialize.toast('Cannot process. Try some other time.',4000);
				$(`button[data-node='${product}']`).removeAttr('disabled').addClass('white');
				$(`button[data-node='${product}']`).children('i').removeClass('grey-text').addClass('pink-text');
			}
		});
	},	
	remove:function(employee,product){
		var data = system.ajax('assets/harmony/Process.php?remove-wishlist',[employee,product]);
		data.done(function(data){
			if(data == 1){
				Materialize.toast('This product has been removed to your wishlist.',4000);
				$(`button[data-node='${product}']`).removeAttr('disabled');
			} 
			else{
				Materialize.toast('Cannot process. Try some other time.',4000);
				$(`button[data-node='${product}']`).attr({'disabled':"true"});
			}
		});
	},
	disableButton:function(id){
		var data = wishlist.get(id);
		$.each(data,function(i,v){
			$(`button[data-wishlist='${v[1]}']`).attr({"disabled":"true"}).addClass('white');
			$(`button[data-wishlist='${v[1]}'] i`).removeClass('grey-text').addClass('pink-text');
		});
	}
};


// #1e4799
// #f57e24