{
    "aggs": {
        "ipsrc": {
            "aggs": {
                "down": {
                    "sum": {
                        "field": "roct"
                    }
                },
                "up": {
                    "sum": {
                        "field": "oct"
                    }
                }
            },
            "terms": {
                "field": "ip_src_addr"
            }
        }
    },
    "query": {
        "bool": {
            "must": [
                {
                    "bool": {
                        "should": [
                     		<#list ips as ip>
							   {
							   	"match":{
							   		"ip_src_addr": "${ip}"
							   		}
							   	}
							    <#if ip_has_next>,</#if>
							</#list>
                        ]
                    }
                },
                {
                    "range": {
                        "start_time": {
                            "gte": ${start},
                            "lt": ${end}
                        }
                    }
                }
            ]
        }
    },
    "size": 0
}