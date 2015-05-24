#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       Autor   Roman <romis@wippies.fi>
import json
import urllib2
import cookielib
import traceback
import lxml.html as html


def update_by_type(instance_types, price, image, data):
    price = price.replace('USD/hour', '').replace('$', '').strip()
    for k in data.keys():
        if k in instance_types:
            for lk in data[k]['pricing'].keys():
                for pk in data[k]['pricing'][lk].keys():
                    if pk==image:
                        if 'USD per core/hour' not in price:
                                data[k]['pricing'][lk][pk] = float('%.3f' % \
                                round(data[k]['pricing'][lk][pk] + float(price), 3))
                        else:
                            cores =  data[k]["vCPU"]
                            core_price = cores * float(price.replace('USD per core/hour', '').strip())
                            data[k]['pricing'][lk][pk] = float('%.3f' % \
                            round(data[k]['pricing'][lk][pk] + core_price, 3))
    return data


def update_by_core(virtual_cores, price, image, data):
    price = price.replace('USD/hour', '').replace('$', '').strip()
    for k in data.keys():
        for vc in virtual_cores:
            if vc == data[k]['vCPU']:
                for lk in data[k]['pricing'].keys():
                    for pk in data[k]['pricing'][lk].keys():
                        if pk==image:
                            data[k]['pricing'][lk][pk] = float('%.3f' %\
                            round(data[k]['pricing'][lk][pk] + float(price), 3))
    return data


def main():
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
    opener.addheaders = [('User-agent', 'Mozilla/5.0')]
    response = opener.open('https://cloud.google.com/compute/pricing', None, timeout=60).read()
    doc = html.document_fromstring(response)
    us_table = doc.xpath(".//h3[text()='US']//following-sibling::table/.//th[contains(text(), 'Machine type')]/parent::*/parent::*")
    us_families = doc.xpath(".//h3[text()='US']/following-sibling::h4/text()")
    eu_table = doc.xpath(".//h3[text()='Europe / Asia']//following-sibling::table/.//th[contains(text(), 'Machine type')]/parent::*/parent::*")
    eu_families = doc.xpath(".//h3[text()='Europe / Asia']/following-sibling::h4/text()")
    apac_table = doc.xpath(".//h3[text()='Europe / Asia']//following-sibling::table/.//th[contains(text(), 'Machine type')]/parent::*/parent::*")
    apac_families = doc.xpath(".//h3[text()='Europe / Asia']/following-sibling::h4/text()")
    D = {'us' : (us_table, us_families),
    'eu' : (eu_table, eu_families),
    'apac' : (apac_table, apac_families)}
    data = {}
    for k in D.keys():
        for i in range(len(D[k][0])):
            family = D[k][1][i]
            trs = D[k][0][i].xpath(".//tr")
            for tr in trs:
                tds = tr.xpath(".//td")
                l = []
                for td in tds:
                    l.append(' '.join(td.xpath(".//text()")))
                if len(l)>5:
                    try:
                        l[3]=float(l[3])
                    except ValueError:
                        pass
                    try:
                        l[2]=float(l[2].replace('GB', ''))
                    except ValueError:
                        pass
                    try:
                        l[-2]=float(l[-2].replace('$', ''))
                    except ValueError:
                        pass
                    try:
                        l[-1]=float(l[-1].replace('$', ''))
                    except ValueError:
                        pass

                    if ' ' in l[0]: # We should omit the remarks Google are putting on it - in our case it's '6' which is not necessary.
                        l[0]=' '.join([x for x in l[0].split(' ') \
                        if x not in [str(i) for i in range(1, 20)]]).\
                        replace('( ', '(').replace(' )', ')').replace('  ', ' ') # Regarding the 'Beta' - it would be better if we could get rid of double spacing (in our json it's appears as '( Beta )'.
                    if l[0] in data.keys():
                        data[l[0]]["pricing"][k] = {"linux" : l[-2],\
                        "windows" : l[-2],"rhel" : l[-2],"suse" : l[-2], "preemptible":l[-1]}
                    else:
                        data[l[0]] = {"family": family, "vCPU": int(l[1]), "memory": l[2],\
                        "instance_type": l[0], "GECU": l[3],\
                        "pricing": {k : {"linux": l[-2],"windows": l[-2],\
                        "rhel": l[-2],"suse": l[-2], "preemptible":l[-1]}}}

    suse = doc.xpath(".//h3[text()='SUSE images']/following-sibling::ul[1]/li")
    for s in suse:
        row = [x.strip().replace('\n', '') for x in s.xpath(".//text()") if len(x.strip())>0]
        price = row[0]
        clause = ' '.join(row[1:])
        if clause == 'for f1-micro and g1-small machine types':
            data = update_by_type(['f1-micro', 'g1-small'], price, 'suse', data)
        elif clause == 'for all other machine types':
            data = update_by_type([x for x in data.keys() if x not in \
            ['f1-micro', 'g1-small']], price, 'suse', data)
        else: raise ValueError("Unknown clause: '%s'" % clause)

    rhel = doc.xpath(".//h3[text()='Red Hat Enterprise Linux (RHEL) images']/following-sibling::ul[1]/li")
    for r in rhel:
        row = [x.strip().replace('\n', '') for x in r.xpath(".//text()") if len(x.strip())>0]
        price = row[0]
        clause = ' '.join(row[1:])
        if clause == 'for machine types with less than 8 virtual    CPUs':
            data = update_by_core([1, 2, 4], price, 'rhel', data)
        elif clause == 'for machine types with 8 virtual CPUs or    more':
            data = update_by_core([8, 16, 32], price, 'rhel', data)
        else: raise ValueError("Unknown clause: '%s'" % clause)

    windows = doc.xpath(".//h3[text()='Windows server images']/following-sibling::ul[1]/li")
    for w in windows:
        row = [x.strip().replace('\n', '') for x in w.xpath(".//text()") if len(x.strip())>0]
        price = row[0]
        clause = ' '.join(row[1:])
        if clause == 'for f1-micro and g1-small machine types':
            data = update_by_type(['f1-micro', 'g1-small'], price, 'windows', data)
        elif clause == 'for all other machine types':
            data = update_by_type([x for x in data.keys() if x not in \
            ['f1-micro', 'g1-small']], price, 'windows', data)
        else: raise ValueError("Unknown clause: '%s'" % clause)

    with open('instances.json', 'w') as instances:
        json.dump([data[k] for k in sorted(data.keys())], \
        instances, sort_keys=False, indent=4)


if __name__ == '__main__':
    try:
        main()
    except:
        traceback.print_exc(file = open("error.txt","w"))
        traceback.print_exc()
