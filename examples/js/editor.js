/* global ace, $, PDFObject, pdf, doc */
/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = function () {

	var editor, demos = {
		'images.js': 'Images',
		'font-faces.js': 'Font faces, text alignment and rotation',
		'two-page.js': 'Two page Hello World',
		'circles.js': 'Circles',
		'cell.js': 'Cell',
		'font-size.js': 'Font sizes',
		'landscape.js': 'Landscape',
		'lines.js': 'Lines',
		'rectangles.js': 'Rectangles',
		'string-splitting.js': 'String Splitting',
		'text-colors.js': 'Text colors',
		'triangles.js': 'Triangles',
		'user-input.js': 'User input',
		'acroforms.js': 'AcroForms',
		'autoprint.js': 'Auto print',
		'arabic.js': 'Arabic',
		'russian.js': 'Russian',
		'japanese.js': 'Japanese'
	};

	var aceEditor = function () {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/github");
		editor.setOptions({
			fontFamily: "monospace",
			fontSize: "12px"
		});
		editor.getSession().setMode("ace/mode/javascript");
		editor.getSession().setUseWorker(false); // prevent "SecurityError: DOM Exception 18"

		var timeout;
		editor.getSession().on('change', function () {
			// Hacky workaround to disable auto refresh on user input
			if ($('#auto-refresh').is(':checked') && $('#template').val() != 'user-input.js') {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function () {
					jsPDFEditor.update();
				}, 200);
			}
		});
	};

	var populateDropdown = function () {
		var options = '';
		for (var demo in demos) {
			options += '<option value="' + demo + '">' + demos[demo] + '</option>';
		}
		$('#template').html(options).on('change', loadSelectedFile);
	};

	var loadSelectedFile = function () {
		if ($('#template').val() == 'user-input.js') {
			$('.controls .checkbox').hide();
			$('.controls .alert').show();
			jsPDFEditor.update(true);
		} else {
			$('.controls .checkbox').show();
			$('.controls .alert').hide();
		}

		$.get('examples/js/' + $('#template').val(), function (response) {
			editor.setValue(response);
			editor.gotoLine(0);

			// If autorefresh isn't on, then force it when we change examples
			if (!$('#auto-refresh').is(':checked')) {
				jsPDFEditor.update();
			}

		}, 'text').fail(function () {

			$('.template-picker').html('<p class="source">More examples in <b>examples/js/</b>. We can\'t load them in automatically because of local filesystem security precautions.</p>');

			// Fallback source code
			var source = "";

			source += "\n";
			source +="var truong='THCS Nguyễn Trãi';\nvar hieutruong='Nguyễn Minh Quốc';\nvar truongphong='Nguyễn Minh Quốc';\nvar khoangay='25-05-2019';\nvar ubnd='UBND THÀNH PHỐ PHAN THIẾT';\nvar ngay='25';\nvar thang='05';\nvar sovb='19/0110';\nvar tbl_doc=100;";
			// source += "var doc = new jsPDF({unit: \"pt\",orientation: \"p\",lineHeight: 1.2});\n";
			// source += "\n";

			// source += "doc.addFont(\"Arimo-Regular.ttf\", \"Arimo\", \"normal\");\n//doc.addFont(\"Arimo-Bold.ttf\", \"Arimo\", \"bold\");\ndoc.setFont(\"Arimo\");\ndoc.setFontType(\"normal\");\ndoc.setFontSize(28);\n";
			// source += "doc.text(\"rồi\", 40, 30, 4);\n";
			// source += "doc.addPage('a5','l');\n";
			// source += "var gg=job[Object.keys(job)[0]];\n";
			// source += "for(var i=0;i<gg.length;i++){\nvar item=gg[i];\nvar hoten=item[Object.keys(item)[1]];\ndoc.text(hoten, 40, 30, 0);\ndoc.addPage('a5','l');\n};\n";
			editor.setValue(source);
			editor.gotoLine(0);
		});
	};

	var initAutoRefresh = function () {
		$('#auto-refresh').on('change', function () {
			if ($('#auto-refresh').is(':checked')) {
				$('.run-code').hide();
				jsPDFEditor.update();
			} else {
				$('.run-code').show();
			}
		});

		$('.run-code').click(function () {
			jsPDFEditor.update();
			return false;
		});
	};

	var initDownloadPDF = function () {
		$('.download-pdf').click(function () {
			eval('try{' + editor.getValue() + '} catch(e) { console.error(e.message,e.stack,e); }');

			var file = demos[$('#template').val()];
			if (file === undefined) {
				file = 'demo';
			}
			if (typeof doc !== 'undefined') {
				doc.save(file + '.pdf');
			} else if (typeof pdf !== 'undefined') {
				setTimeout(function () {
					pdf.save(file + '.pdf');
				}, 2000);
			} else {
				alert('Error 0xE001BADF');
			}
		});
		return false;
	};

	function CharCompare(a, b, index) {
		var alphabets = ["a","á","à","ả","ã","ạ","ă","ắ","ằ","ẳ","ẵ","ặ","â","ấ","ầ","ẩ","ẫ","ậ","b","c","d","e","é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ","g","h","i","í","ì","ỉ","ĩ","ị","k","l","m","n","o","ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ","p","q","r","s","t","u","ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự","v","x","y","ý","ỳ","ỷ","ỹ","ỵ"];
	  if (index == a.length || index == b.length)
	      return 0;
	  //toUpperCase: isn't case sensitive
	  var aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
	  var bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
	  if (aChar != bChar)
	      return aChar - bChar;
	  else
	      return CharCompare(a,b,index+1);
			};

	return {
		/**
		 * Start the editor demo
		 * @return {void}
		 */
		init: function () {

			// Init the ACE editor
			aceEditor();

			populateDropdown();
			loadSelectedFile();
			// Do the first update on init
			jsPDFEditor.update();

			initAutoRefresh();

			initDownloadPDF();
		},
		/**
		 * Update the iframe with current PDF.
		 *
		 * @param  {boolean} skipEval If true, will skip evaluation of the code
		 * @return
		 */
		update: function (skipEval) {
			setTimeout(function () {

				if (!skipEval) {
					eval('try{' + editor.getValue() + '} catch(e) { console.error(e.message,e.stack,e); }');
					var doc = new jsPDF({unit: "pt",orientation: "p",lineHeight: 0,format:"a4"});
					//var doc = new jsPDF('p', 'pt', 'a4', true);
					//doc.addFont("Arimo-Regular.ttf", "Arimo", "normal");
					//doc.addFont("times.ttf", "Times", "normal");
					//doc.addFont("timesi.ttf", "Times", "italic");
					//doc.addFont("Arimo-Bold.ttf", "Arimo", "bold");
					//doc.setFont("Times");
					//doc.setFontType("normal");
					//doc.setFontSize(sizeFont);
					//doc.text("rồi", cngang, cdoc, 0);
					//doc.addPage('a5','l');

					doc.addFont("Arimo-Regular.ttf", "Arimo", "normal");
					doc.addFont("times.ttf", "Times", "normal");
					doc.addFont("timesi.ttf", "Times", "italic");
					doc.addFont("timesbd.ttf", "Times", "bold");
					//doc.addFont("Arimo-Bold.ttf", "Arimo", "bold");
					doc.setFont("Times");
					doc.setFontType("normal");
					doc.setFontSize(10);

					var gg=job[Object.keys(job)[0]];
					gg.sort(function(a, b) {
    return CharCompare(a["tên"], b["tên"], 0);
});
					var cong=50;

					var ubnd_ngang=40;
					var ubnd_doc=30;

					var truong_ngang=40;
					var truong_doc=45;

					var dscn_ngang=120;
					var dscn_doc=70;

					var namhoc_ngang=140;
					var namhoc_doc=85;

					var khoangay_ngang=310;
					var khoangay_doc=85;

					var dst_ngang=40;
					var dst_doc=30;

					var td_ngang=40;
					var td_doc=45;

					var ngay_ngang=90;
					var ngay_doc=60;

					var ht_ngang=120;
					var ht_doc=75;

					var htt_ngang=100;
					var htt_doc=150;

					var dcp_ngang=360;
					var dcp_doc=40;

					var ngay2_ngang=380;
					var ngay2_doc=60;

					var tp_ngang=410;
					var tp_doc=75;

					var tpp_ngang=400;
					var tpp_doc=150;

					doc.setFont("Times");
					doc.setFontType("bold");
					doc.setFontSize(10);
					doc.text(ubnd, ubnd_ngang, ubnd_doc, 0);
					doc.text("Trường "+truong, truong_ngang, truong_doc, 0);
					doc.setFontSize(12);
					doc.text("DANH SÁCH CÔNG NHẬN TỐT NGHIỆP TRUNG HỌC CƠ SỞ", dscn_ngang, dscn_doc, 0);
					doc.setFontSize(10);
					doc.text("NĂM HỌC 2018-2019", namhoc_ngang, namhoc_doc, 0);
					doc.text("KHÓA NGÀY: "+khoangay, khoangay_ngang, khoangay_doc, 0);

					//doc.setFontSize(10);
					// doc.text("Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam", cngang_chxh, cdoc_chxh, 0);
					// doc.text("Độc lập - Tự do - Hạnh phúc", cngang_dltd, cdoc_dltd, 0);
					// doc.rect(325, 42+cong, 122, 0.5, 'S');
					// doc.text("Trường "+truong, cngang_truong, cdoc_truong, 0);
					// doc.setFont("Times");
					// doc.setFontType("bold");
					// doc.setFontSize(12);
					// doc.text("GIẤY CHỨNG NHẬN TỐT NGHIỆP TRUNG HỌC CƠ SỞ (Tạm thời)", cngang_cntn, cdoc_cntn, 0);
					var body=[];
					var vb=1;
					var gioi=0;
					var kha=0;
					var tb=0;
					for(var i=0;i<gg.length;i++){

						var item=gg[i];

						var ho=item["Họ"];
						var ten=item["tên"];
						var ngaysinh=item["Ngày sinh"];
						var gioitinh=item["Giới tính"];
						var dantoc=item["Dân tộc"];
						var noisinh=item["Nơi sinh"];
						var lop=item["HS lớp"];
						var xl=item["Xếp loại tốt nghiệp"];
						if(xl=='G'){
							xl="Giỏi";
							gioi+=1;
						}
						else if(xl=='K'){
							xl="Khá";
							kha+=1;
						}
						else if(xl=='Tb'){
							xl="Trung bình";
							tb+=1;
						}

						var so=sovb;
						if(vb<10)
							so+="000"+vb;
						else if(vb<100)
							so+="00"+vb;
						else if(vb<1000)
							so+="0"+vb;
						else if(vb<10000)
							so+=vb.toString();


						var b1=[vb,ho,ten,ngaysinh,gioitinh,dantoc,noisinh,lop,xl,so];
						body.push(b1);
						vb++;
					};

					doc.autoTable({head:[['STT','Họ và tên','Ngày sinh','Giới tính','Dân tộc','Nơi sinh','HS lớp','Xếp loại tốt nghiệp','Số văn bằng']],body:body,
												theme: 'plain',
												startY: tbl_doc,
												styles: { // Defaul style
													lineWidth: 0.01,
													lineColor: 0,
													fillStyle: 'DF',
													halign: 'center',
													valign: 'middle',
													columnWidth: '15',
													overflow: 'linebreak',
													font: "Times",
													fontSize:8,
													cellWidth: 'wrap'
												},headerStyles: { fontStyle: 'Times',fontSize:8,cellWidth: 'wrap' },didParseCell:(data)=>{
					          if(data.section=='head'&&data.row.index==0&&data.column.index==1){
					            data.row.cells[1].colSpan=2;
					            //description above refer to the column of the table on the lastrow
					          }
										// if((data.section=='head'&&data.cell.raw=='TB Năm')||(data.section=='head'&&data.cell.raw=='Học lực')||(data.section=='head'&&data.cell.raw=='Hạnh kiểm')||(data.section=='head'&&data.cell.raw=='Điểm UT')||(data.section=='head'&&data.cell.raw=='Điểm KK')||(data.section=='head'&&data.cell.raw=='Xếp loại TN')){
										// 	data.row.cells[k].rowSpan=2;
										// 	data.row.cells[k].minWidth=15;
										// 	data.row.cells[k].styles.cellWidth=15;
										// 	k++;
										// }
					        }
											});

											let finalY = doc.autoTable.previous.finalY;

											doc.setFont("Times");
											doc.setFontType("normal");
											doc.setFontSize(10);
											doc.text("Danh sách trên có: "+vb+" học sinh được công nhận tốt nghiệp THCS", dst_ngang, dst_doc+finalY, 0);
											doc.text("Trong đó: "+gioi+" Giỏi   "+kha+" Khá   "+tb+" Trung bình", td_ngang, td_doc+finalY, 0);
											doc.text("Ngày "+ngay+" Tháng "+thang+" Năm 2019", ngay_ngang, ngay_doc+finalY, 0);
											doc.setFontType("bold");
											doc.setFontSize(10);
											doc.text("Hiệu trưởng", ht_ngang, ht_doc+finalY, 0);
											doc.setFontSize(12);
											doc.text(hieutruong, htt_ngang, htt_doc+finalY, 0);
											doc.setFontType("normal");
											doc.setFontSize(10);
											doc.text("Duyệt của phòng Giáo Dục và Đào tạo", dcp_ngang, dcp_doc+finalY, 0);
											doc.text("Ngày "+ngay+" Tháng "+thang+" Năm 2019", ngay2_ngang, ngay2_doc+finalY, 0);
											doc.setFontType("bold");
											doc.setFontSize(10);
											doc.text("Trưởng phòng", tp_ngang, tp_doc+finalY, 0);
											doc.setFontSize(12);
											doc.text(truongphong, tpp_ngang, tpp_doc+finalY, 0);



				}
				if (typeof doc !== 'undefined') try {
					////////////////////////////////


					////////////////////////////////
					if (navigator.appVersion.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Edge") !== -1 || navigator.appVersion.indexOf('Trident') !== -1) {
						var options = {
							pdfOpenParams: {
								navpanes: 0,
								toolbar: 0,
								statusbar: 0,
								view: "FitV"
							},
							forcePDFJS: true,
							PDFJS_URL: 'examples/PDF.js/web/viewer.html'
						};
						PDFObject.embed(doc.output('bloburl'), "#preview-pane", options);
					} else {


						PDFObject.embed(doc.output('datauristring'), "#preview-pane");
					}
				} catch (e) {
					alert('Error ' + e);
				}
			}, 0);

		}
	};

}();

// $(document).ready(function () {
	// jsPDFEditor.init();
// });
