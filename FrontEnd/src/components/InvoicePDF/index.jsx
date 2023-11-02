import {
  StyleSheet,
  Document,
  Page,
  View,
  Text
} from '@react-pdf/renderer';

import { toProperDateTime, splitString } from '../../functions';



const styles = StyleSheet.create({
  table: {
    cell: (borderTop, bottomBorder, leftBorder, rightBorder, children) => ({
      padding: 2,
      borderTop: (borderTop === 2) ? '1px solid black' : (borderTop === 1) ? '0.5px solid black' : '',
      borderBottom: (bottomBorder === 2) ? '1px solid black' : (bottomBorder === 1) ? '0.5px solid black' : '',
      borderLeft: (leftBorder === 2) ? '1px solid black' : (leftBorder === 1) ? '0.5px solid black' : '',
      borderRight: (rightBorder === 2) ? '1px solid black' : (rightBorder === 1) ? '0.5px solid black' : '',
      ...children
    })
  }
});



export default function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size='A4' style={{paddingVertical: 20, paddingLeft: 56, paddingRight: 102, backgroundColor: 'white', fontFamily: 'Helvetica', fontSize: 8, color: 'black'}}>
        {/* header */}
        <View>
          <Text style={{fontSize: 16}}>{invoice.headerLabels.top}</Text>
          <Text style={{fontSize: 8, marginTop: 8}}>{invoice.headerLabels.mid}</Text>
          <Text style={{fontSize: 6, marginTop: 2}}>{invoice.headerLabels.bot}</Text>
        </View>
        


        {/* info */}
        <View style={{marginTop: 12}}>
          {invoice.info.map((item, index) => (
            <View key={index} style={{flexDirection: 'row', marginTop: index ? 2 : 0}}>
              <Text style={{width: 176}}>{item.label}</Text>
              <Text>:</Text>
              <Text style={{marginLeft: 2}}>{(item.type === 'date') ? toProperDateTime(item.value, true) : item.value}</Text>
            </View>
          ))}
        </View>



        {/* table */}
        <View style={{marginTop: 8}}>
          <View>
            {/* table - title */}
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.table.cell(2, 1, 2, 1, {width: 16, textAlign: 'center'})}>{invoice.tableLabels.col1}</Text>
              <Text style={styles.table.cell(2, 1, 0, 0, {flex: 1, textAlign: 'center'})}>{invoice.tableLabels.col2}</Text>
              <Text style={styles.table.cell(2, 1, 1, 1, {width: 60, textAlign: 'center'})}>{invoice.tableLabels.col3}</Text>
              <Text style={styles.table.cell(2, 1, 0, 2, {width: 60, textAlign: 'center'})}>{invoice.tableLabels.col4}</Text>
            </View>

            {/* table - data */}
            {invoice.services.map((service, index) => (
              <View key={index} style={{flexDirection: 'row', borderTop: index ? '0.5px dashed black' : ''}}>
                <View style={styles.table.cell(0, 0, 2, 1, {width: 16, justifyContent: 'center', alignItems: 'center'})}>
                  <Text>{service.no}</Text>
                </View>
                
                <View style={{flex: 1}}>
                  {service.subServices.map((subService, subIndex) => (
                    <View key={subIndex}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.table.cell(0, 0, 0, 0, {flex: 1})}>{subService.name}</Text>
                        <Text style={styles.table.cell(0, 0, 1, 1, {width: 60, fontSize: 7, textAlign: 'center'})}>{
                          (/^[0-9]+$/.test(subService.price))
                            ? `Rp. ${splitString(subService.price, 3, '.')}`
                            : subService.price
                        }</Text>
                        <Text style={styles.table.cell(0, 0, 0, 2, {width: 60})}>{subService.note}</Text>
                      </View>

                      {(invoice.paidShow !== 'total' && subService.paid) && (
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.table.cell(0, 0, 0, 0, {flex: 1})} />
                          <Text style={styles.table.cell(0, 0, 0, 0, {width: 86})}>{invoice.tableLabels.paid}</Text>
                          <Text style={styles.table.cell(0, 0, 1, 1, {width: 60, fontSize: 7, textAlign: 'center'})}>{
                            (/^[0-9]+$/.test(subService.paid))
                              ? `- Rp. ${splitString(subService.paid, 3, '.')}`
                              : subService.paid
                          }</Text>
                          <Text style={styles.table.cell(0, 0, 0, 2, {width: 60})} />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* table - total */}
            {(invoice.priceShow !== 'item') && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.table.cell(1, (invoice.paidShow !== 'item') ? 0 : 2, 2, 0, {flex: 1})} />
                <Text style={styles.table.cell(1, (invoice.paidShow !== 'item') ? 0 : 2, 0, 0, {width: 86})}>{invoice.tableLabels.totalPrice}</Text>
                <Text style={styles.table.cell(1, (invoice.paidShow !== 'item') ? 0 : 2, 1, 1, {width: 60, fontSize: 7, textAlign: 'center'})}>{
                  (/^[0-9]+$/.test(invoice.totalPrice))
                    ? `Rp. ${splitString(invoice.totalPrice, 3, '.')}`
                    : invoice.totalPrice
                }</Text>
                <Text style={styles.table.cell(1, (invoice.paidShow !== 'item') ? 0 : 2, 0, 2, {width: 60})} />
              </View>
            )}

            {/* table - total */}
            {(invoice.paidShow !== 'item') && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.table.cell((invoice.priceShow !== 'item') ? 0 : 1, 2, 2, 0, {flex: 1})} />
                <Text style={styles.table.cell((invoice.priceShow !== 'item') ? 0 : 1, 2, 0, 0, {width: 86})}>{invoice.tableLabels.totalPaid}</Text>
                <Text style={styles.table.cell((invoice.priceShow !== 'item') ? 0 : 1, 2, 1, 1, {width: 60, fontSize: 7, textAlign: 'center'})}>{
                  (/^[0-9]+$/.test(invoice.totalPaid))
                    ? `Rp. ${splitString(invoice.totalPaid, 3, '.')}`
                    : invoice.totalPaid
                }</Text>
                <Text style={styles.table.cell((invoice.priceShow !== 'item') ? 0 : 1, 2, 0, 2, {width: 60})} />
              </View>
            )}
          </View>

          {/* table - grand total */}
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Text style={{flex: 1}} />
            <Text style={{width: 144, fontFamily: 'Helvetica-Bold'}}>{invoice.tableLabels.calculated}</Text>
            <Text style={{width: 60, fontSize: 7, textAlign: 'center', fontFamily: 'Helvetica-Bold', textDecoration: 'underline'}}>Rp. {splitString(invoice.calculated, 3, '.')}</Text>
            <Text style={{width: 60}} />
          </View>
        </View>



        {/* notes */}
        <View style={{flexDirection: 'row', marginTop: 8}}>
          {/* notes - note */}
          <View style={{flex: 1}}>
            {invoice.notes.length > 0 && (
              <>
                <Text style={{marginBottom: 2}}>{invoice.noteLabel}</Text>
                {invoice.notes.map((note, index) => (
                  <Text key={index}>{note}</Text>
                ))}
              </>
            )}
          </View>

          {/* notes - payment */}
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View style={{border: '1px solid black', padding: 2}}>
              <View style={{alignItems: 'center'}}>
                <Text>{invoice.paymentLabels.top}</Text>
              </View>
              <View style={{alignItems: 'center'}}>
              <Text>{invoice.paymentLabels.mid}</Text>
              </View>
              <View style={{alignItems: 'center'}}>
              <Text>{invoice.paymentLabels.bot}</Text>
              </View>
            </View>
          </View>
        </View>



        {/* footer */}
        <View style={{alignItems: 'flex-end', marginTop: 22}}>
          <Text>{invoice.city}, {toProperDateTime(invoice.createDate, true)}</Text>
        </View>
      </Page>
    </Document>
  );
};
