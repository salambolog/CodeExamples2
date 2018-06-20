console.log("running");
var i,
item = '',
newItems = [],
newSubItems = '';
for (i = 0; i < objects.length; i++) 
{
	var subitems = objects[i].objects,
	subItemsTotal= subitems.length;
	item=`
	<div class="item" >
		<div class="row">
			<div class="swatch col-xs-1">
				<img src="assets/img/` + objects[i].name.split(' ').join('') + `.jpg" />
			</div>
			<div class="item col-xs-9"> ` + objects[i].name + `</div>
			<div class="col-xs-1">
				<p class="text-circle">` + subItemsTotal + `</p>
			</div>
			<div class="col-xs-1"><svg class="triangle" xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7">
			<path fill="#7991DB" fill-rule="evenodd" d="M.807.711L6.61 6.514 12.274.85z"/>
		</svg>
		</div>
		</div>
		<div class="subitem">
	`;

	/////build your title row sublist thing here
	var sublist = `
					<div class="row">
						<div class="col-xs-3 col-xs-offset-1 underlay">Underlayment</div>
						<div class="col-xs-2 rating"> IIC Rating </div>
						<div class="col-xs-2 deci"> Decibels </div>
						<div class="col-xs-3 soundBite"> IIC Sound Bite</div>
					</div>`;
	
	for (j = 0; j < subitems.length; j++) {
		newSubItems += `
					<div class="row floor" data-floorAssembly="` + subitems[j].AssemblyType + `" 
					data-ceilingInsulation="` + subitems[j].Ceiling + `" 
                    data-residential="` + subitems[j].ResidentialSegment + `" 
                    data-RetailRestaurantSegment="` + subitems[j].RetailRestaurantSegment + `" 
                    data-EducationSegment="` + subitems[j].EducationSegment + `" 
                    data-HealthcareSegment="` + subitems[j].HealthcareSegment + `" 
                    data-HospitalitySegment="` + subitems[j].HospitalitySegment + `" 
                    data-SpecifiedLivingSegment="` + subitems[j].SpecifiedLivingSegment + `" 
                    data-OfficeSegment="` + subitems[j].OfficeSegment + `" 
					data-decibels="` + subitems[j].decibels + `">
						<div class="col-xs-3 col-xs-offset-1">` + subitems[j].Underlayment + `</div>
						<div class="col-xs-2">` + subitems[j].IICClass + `</div>						
						<div class="col-xs-2">` + subitems[j].decibels + ` </div>
						<div class="col-xs-4">
							<input type="button" class="btn-play" /><div class="soundBar"></div>
								<audio class="soundFile" onclick='myFunction()' controls>
							 		<source src="` + subitems[j].fileUrl + `" type="audio/wav" autostart="true">
							 	</audio>
							<div class="bars"></div>
						</div>
					</div>`;
	}
	newItems.push(item + sublist + newSubItems + `</div></div>`);
	newSubItems = '';
}
$('.item-list').append(newItems);

$('.item-list .item > .row').on('click touch', function(e) {
	e.preventDefault();
	$(this).parent().siblings('.active').removeClass('active').find('.subitem').slideUp();
	$(this).parent().toggleClass('active').siblings('.active');
	$(this).siblings('.subitem').slideToggle();

})



var floorAssembly = '12in TJI',
ceilingInsulation = 'true',
buildingType = 'Residential';

// $('ul .iicNumList').on('click touch', function(e){
// 	e.preventDefault();
	
// })

$('ul.iicNumList li').on('click touch', function() {
	// var listNum = $('');
	$(this).parent().addClass('hidden').siblings().removeClass('hidden');
	rangeSet($(this));
});

$('.range').blur( function(e){
	rangeSet($(this));
})


var min = 0,
max = 70;
function rangeSet (range){
	/////check if min and max exists if so then run the function below(filterItems) with min and max passed in
	////todo get the name of the input (min and max) 
	var object = range.attr('name');
	value = (range.attr('data-indexnum')) ? range.attr('data-indexnum') : $('.range.' + object).val(),
	text = (range.text().length > 0) ? range.text() : $('.range.' + object).val();
	if (object === 'min' && value.length > 0)  min = value;
	if (object === 'max' && value.length > 0)  max = value;
	//nother note get the value of the same input (min and max)
	//set the range using the min and the max
	$('.range.' + object).val(text);
	$('.iicLabel').text(min + ' - ' + max)
	filterItems($('input[name="iicRatingRange"]'), min, max)
	if (object === 'max') {
		$('#iicBlock').toggleClass('active');
		$('label#anyIIC').toggleClass('activateIIC');
		$('label#anyIIC').toggleClass('buttonChange');
	}

}

function filterItems(filter, minRange, maxRange) {
	var type = filter.attr('data-toggle').toLowerCase(),
	typeValue = filter.val(),
	group = filter.attr('name');
	floorAssembly = (group === 'floorAssembly' && typeValue.length > 0) ? typeValue : floorAssembly;
	ceilingInsulation = (group === 'ceilingInsulation' && typeValue.length > 0) ? typeValue : ceilingInsulation;
	buildingType = (group === 'buildingType' && typeValue.length > 0) ? type : buildingType;
	minRange = (group === 'iicRatingRange' && minRange.length > 0) ? minRange : 0;
	maxRange = (group === 'iicRatingRange' && maxRange.length > 0) ? maxRange : 70;


	$('.subitem .floor').each(function(){
		if ($(this).attr('data-floorassembly') === floorAssembly && $(this).attr('data-ceilinginsulation') === ceilingInsulation && $(this).attr('data-' + buildingType) === 'true' && $(this).attr('data-decibels') > minRange && $(this).attr('data-decibels') < maxRange ) {
			$(this).removeClass('hidden');
		} else {
			$(this).addClass('hidden');
		}
	})
	
	$('.subitem').each(function(){
		console.log($(this).find('.floor:not(.hidden)'))
		if ($(this).find('.floor:not(.hidden)').length > 0) {
			$(this).closest('.item').removeClass('hidden');
		} else {
			$(this).closest('.item').addClass('hidden');
		}
	})
}

$('form input').on('click touch', function(e) {
	filterItems($(this));
});


function createSoundwave (button) {
	var bars = [];
	for (var i = 0; i < 25; i++) {
	
	  var left = i * 4 + 5;
	  var anim = Math.floor(Math.random() * 75 + 300);
	  var height = Math.floor(Math.random() * 25 + 50);
	  // console.log(height);
	
	  bars.push('<div class="bar" style="left:' + left + 'px;animation-duration:' + anim + 'ms;height:' + height + 'px"></div>'); 
	}
	setTimeout(function(){
		destroySoundwave(button)
	}, 4000);
	button.siblings('.soundBar').addClass('vanishSoundBar');
	button.addClass('active').siblings('.bars').html(bars)
	button.siblings('.soundFile')[0].play();
	button.siblings('.soundFile').addClass('playing');
	
}

function destroySoundwave (button) {
	var aud = $('.playing');
	$('.btn-play.active').removeClass('active').siblings('.bars').html('');
	button.siblings('.soundBar').removeClass('vanishSoundBar');


	// pause any other playing audio
	if ($('.playing')[0]) {
		$('.playing')[0].pause();
		$('.playing')[0].currentTime = 0;
		$('.playing').siblings('.bars').html('');
		$('.playing').siblings('.btn-pause').removeClass('btn-pause').addClass('btn-play');
		$('.soundBar.vanishSoundBar').removeClass('vanishSoundBar');
		$('.playing').removeClass('playing');
	}

}

// button functionality///////////////////////

$('#anyIIC').on('click touch', function(e) {
	$('#iicBlock').toggleClass('active');
	$('label#anyIIC').toggleClass('activateIIC');
	$('label#anyIIC').toggleClass('buttonChange');
});


$('.btn-play').on("click touch", function() {
	if ($(this).hasClass('active')) {
		$(this).addClass('btn-play').removeClass('btn-pause');
		destroySoundwave($(this));
	} else {
		$(this).removeClass('btn-play').addClass('btn-pause');
		createSoundwave($(this));
	}
});

////////button closers//////////
$('.Useful-Tips-Legal').on('click touch', function(){
	$('.activeLegal').toggleClass('active');
});


$('.Close').on('click touch', function(){
	$('.activeLegal').removeClass('active');
});
// button functionality end////////////////////////////////////////////////////////////////

$(document).mouseup(function(e) 
{
    var container = $('.activeLegal.active');
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.toggleClass('active');
    }
});

$(document).mouseup(function(e) 
{
	var container2 = $('#iicBlock.active');
	 if (!container2.is(e.target) && container2.has(e.target).length === 0) 
    {
		container2.toggleClass('active');
		// container2.toggleClass('buttonChange');
    }
});

/////////////////footer stable

$(function(){
    $(window).resize(function(e){
        placeFooter();
    });
    placeFooter();
    // hide it before it's positioned
    $('.fixedfoot').css('display','inline');
});

function placeFooter() {    
    var windHeight = $(window).height();
    var footerHeight = $('.fixedfoot').height();
    var offset = parseInt(windHeight) - parseInt(footerHeight);
    $('.fixedfoot').css('top',offset);
}
 //////////////////end footer stable