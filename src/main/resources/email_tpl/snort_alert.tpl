<html>
<head>
<style type="text/css">
		.email-tbl{margin:0;padding:0;width:800px;height:auto;margin:0 auto;text-align:center;border-top:1px solid #333;border-left:1px solid #333;}
		.email-tbl tr td{margin:0;padding:0;border-right:1px solid #333;border-bottom:1px solid #333;}
		.email-tbl tr{height:40px;}
		.email-tbl thead tr td{background:#eff5fb;}
</style>
</head>
<body>
<table cellpadding="0"  cellspacing="0" class="email-tbl">
		<thead>
			<tr>
				<td>time</td>
				<td>type</td>
				<td>protocol</td>
				<td>src</td>
				<td>dst</td>
				<td>city</td>
				<td>msg</td>
			</tr>
		</thead>
	<tbody>
		<#list datas as data>
				<tr>
					<td>${data.collectTime!""}</td>
					<td>${data.type!""}</td>
					<td>${data.protocol!""}</td>
					<td>${data.srcIp!""}</td>
					<td>${data.dstIp!""}</td>
					<td>${data.dstCity!""}</td>
					<td>${data.msg!""}</td>
				</tr>
		</#list>
	</tbody>
</table>
</body>
</html>
		

