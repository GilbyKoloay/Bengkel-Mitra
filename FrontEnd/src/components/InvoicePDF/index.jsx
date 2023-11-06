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
    row: (flex, borderTop, bottomBorder, leftBorder, rightBorder, children) => ({
      flex: flex,
      borderTop: (borderTop === 3) ? '0.5px dashed black' : (borderTop === 2) ? '1px solid black' : (borderTop === 1) ? '0.5px solid black' : '',
      borderBottom: (bottomBorder === 2) ? '1px solid black' : (bottomBorder === 1) ? '0.5px solid black' : '',
      borderLeft: (leftBorder === 2) ? '1px solid black' : (leftBorder === 1) ? '0.5px solid black' : '',
      borderRight: (rightBorder === 2) ? '1px solid black' : (rightBorder === 1) ? '0.5px solid black' : '',
      ...children
    })
  }
});



const TableCol2Row1 = ({ value }) => {
  if (value) return (
    <Text style={{padding: 2}}>{value}</Text>
  );

  else if (!value) return (
    <Text style={{padding: 2}}> </Text>
  );
};

const TableCol2Row2 = ({ value, check }) => {
  if (check) return (
    <View style={{padding: 2, flexDirection: 'row'}}>
      <View style={{flex: 5}} />
      <Text style={{flex: 2}}>{value}</Text>
    </View>
  );

  else if (!check) return (
    <View style={{padding: 2, flexDirection: 'row'}}>
      <View style={{flex: 5}} />
      <Text style={{flex: 2}}> </Text>
    </View>
  );
};

const TableCol3 = ({ value }) => {
  if (value && /^[0-9]+$/.test(value.trim())) return (
    <View style={{padding: 2, flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>Rp. </Text>
      <Text>{splitString(value.trim(), 3, '.')}</Text>
    </View>
  );

  else if (value && !/^[0-9]+$/.test(value.trim())) return (
    <Text style={{padding: 2, textAlign: 'center'}}>{value}</Text>
  );

  else if (!value) return (
    <Text style={{padding: 2, textAlign: 'center'}}> </Text>
  );
};



export default function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size='A4' style={{paddingVertical: 22, paddingLeft: 24, paddingRight: 38, backgroundColor: 'white', fontFamily: 'Helvetica', fontSize: 10, color: 'black'}}>
        {/* header */}
        <View>
          <Text style={{fontSize: 16}}>{invoice.headerLabels.top}</Text>
          <Text style={{fontSize: 8, marginTop: 12}}>{invoice.headerLabels.mid}</Text>
          <Text style={{fontSize: 8, marginTop: 4}}>{invoice.headerLabels.bot}</Text>
        </View>
        


        {/* info */}
        <View style={{marginTop: 14, gap: 2}}>
          {invoice.info.map((item, index) => (
            <View key={index} style={{flexDirection: 'row'}}>
              <Text style={{width: 176}}>{item.label}</Text>
              <Text>:</Text>
              <Text style={{marginLeft: 2}}>{(item.type === 'date') ? toProperDateTime(item.value, true) : item.value}</Text>
            </View>
          ))}
        </View>



        {/* table */}
        <View style={{marginTop: 12}}>
          {/* table - title */}
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.table.row(1, 2, 1, 2, 1, {textAlign: 'center'})}>{invoice.tableLabels.col1}</Text>
            <Text style={styles.table.row(7, 2, 1, 0, 0, {textAlign: 'center'})}>{invoice.tableLabels.col2}</Text>
            <Text style={styles.table.row(2, 2, 1, 1, 1, {textAlign: 'center'})}>{invoice.tableLabels.col3}</Text>
            <Text style={styles.table.row(2, 2, 1, 0, 2, {textAlign: 'center'})}>{invoice.tableLabels.col4}</Text>
          </View>

          {/* table - data */}
          {invoice.services.map((service, index) => (
            <View key={index} style={{flexDirection: 'row'}}>
              {/* table - data - col 1 */}
              <View style={styles.table.row(1, index ? 3 : 0, (index === invoice.services.length-1) ? 2 : 0, 2, 1, {justifyContent: 'center', alignItems: 'center'})}>
                <Text style={{padding: 2}}>{service.no}</Text>
              </View>

              {/* table - data - col 2 */}
              <View style={styles.table.row(7, index ? 3 : 0, (index === invoice.services.length-1) ? 2 : 0, 0, 0)}>
                {((invoice.paidType === 'ITEM')) ? service.subServices.map((subService, subIndex) => (
                  <View key={subIndex}>
                    <TableCol2Row1 value={subService.name} />
                    <TableCol2Row2 value={invoice.tableLabels.paid} check={subService.paid} />
                  </View>
                )) : (invoice.paidType === 'NUMBER') ? (
                  <>
                    {service.subServices.map((subService, subIndex) => (
                      <TableCol2Row1 key={subIndex} value={subService.name} />
                    ))}
                    <TableCol2Row2 value={invoice.tableLabels.paid} check={service.paid} />
                  </>
                ) : (invoice.paidType === 'NULL') && service.subServices.map((subService, subIndex) => (
                  <TableCol2Row1 key={subIndex} value={subService.name} />
                ))}
              </View>

              {/* table - data - col 3 */}
              <View style={styles.table.row(2, index ? 3 : 0, (index === invoice.services.length-1) ? 2 : 0, 1, 1)}>
                {((invoice.priceType === 'ITEM') && (invoice.paidType === 'ITEM')) ? service.subServices.map((subService, subIndex) => (
                  <View key={subIndex}>
                    <TableCol3 value={subService.price} isPrice />
                    <TableCol3 value={subService.paid} />
                  </View>
                )) : ((invoice.priceType === 'ITEM') && (invoice.paidType === 'NUMBER')) ? (
                  <>
                    {service.subServices.map((subService, subIndex) => (
                      <TableCol3 key={subIndex} value={subService.price} isPrice />
                    ))}
                    <TableCol3 value={service.paid} />
                  </>
                ) : (((invoice.priceType === 'ITEM') && (invoice.paidType === 'NULL'))) ? service.subServices.map((subService, subIndex) => (
                  <TableCol3 key={subIndex} value={subService.price} isPrice />
                )) : ((invoice.priceType === 'NUMBER') && (invoice.paidType === 'NUMBER')) ? (
                  <>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <TableCol3 value={service.price} isPrice />
                    </View>
                    <TableCol3 value={service.paid} />
                  </>
                ) : ((invoice.priceType === 'NUMBER') && (invoice.paidType === 'NULL')) ? (
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <TableCol3 value={service.price} isPrice />
                  </View>
                ) : ((invoice.priceType === 'NULL') && (invoice.paidType === 'ITEM')) ? service.subServices.map((subService, subIndex) => (
                  <View key={subIndex}>
                    <TableCol3 value='' isPrice />
                    <TableCol3 value={subService.paid} />
                  </View>
                )) : ((invoice.priceType === 'NULL') && (invoice.paidType === 'NUMBER')) ? (
                  <>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <TableCol3 value='' isPrice />
                    </View>
                    <TableCol3 value={service.paid} />
                  </>
                ) : (((invoice.priceType === 'NULL') && (invoice.paidType === 'NULL'))) && (
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <TableCol3 value='' isPrice />
                  </View>
                )}
              </View>

              {/* table - data - col 4 */}
              <View style={styles.table.row(2, 0, (index === invoice.services.length-1) ? 2 : 0, 0, 2)}>
                {((invoice.paidType === 'ITEM') && (invoice.noteType === 'ITEM')) ? service.subServices.map((subService, subIndex) => (
                  <View key={subIndex} style={{padding: 2, flex: 1, justifyContent: 'center'}}>
                    <Text>{subService.note}</Text>
                  </View>
                )) : ((invoice.paidType === 'ITEM') && (invoice.noteType === 'NUMBER')) ? (
                  <View style={{padding: 2, flex: 1, justifyContent: 'center'}}>
                    <Text>{service.note}</Text>
                  </View>
                ) : ((invoice.paidType === 'NUMBER') && (invoice.noteType === 'ITEM')) ? (
                  <>
                    {service.subServices.map((subService, subIndex) => subService.note ? (
                      <Text key={subIndex} style={{padding: 2}}>{subService.note}</Text>
                    ) : !subService.note && (
                      <Text key={subIndex} style={{padding: 2}}> </Text>
                    ))}
                    <Text style={{padding: 2}}> </Text>
                  </>
                ) : ((invoice.paidType === 'NUMBER') && (invoice.noteType === 'NUMBER')) ? (
                  <>
                    <View style={{padding: 2, flex: 1, justifyContent: 'center'}}>
                      <Text>{service.note}</Text>
                    </View>
                    <Text style={{padding: 2}}> </Text>
                  </>
                ) : ((invoice.paidType === 'NULL') && (invoice.noteType === 'ITEM')) ? service.subServices.map((subService, subIndex) => (
                  <View key={subIndex} style={{padding: 2, flex: 1, justifyContent: 'center'}}>
                    <Text>{subService.note}</Text>
                  </View>
                )) : ((invoice.paidType === 'NULL') && (invoice.noteType === 'NUMBER')) && (
                  <View style={{padding: 2, flex: 1, justifyContent: 'center'}}>
                    <Text>{service.note}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
        {/* table - grand total */}
        <View>
          {invoice.isTotalPriceShown && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.table.row(1, 0, 0, 2, 0)}> </Text>
              <Text style={styles.table.row(5, 0, 0, 0, 0)}> </Text>
              <Text style={styles.table.row(2, 0, 0, 0, 0, {paddingVertical: 2})}>{invoice.tableLabels.totalPrice}</Text>
              {/^[0-9]+$/.test(invoice.totalPrice.trim()) ? (
                <View style={styles.table.row(2, 0, 0, 1, 1, {flexDirection: 'row', justifyContent: 'space-between'})}>
                  <Text style={{paddingVertical: 2, paddingLeft: 2}}>Rp. </Text>
                  <Text style={{paddingVertical: 2, paddingRight: 2}}>{splitString(invoice.totalPrice.trim(), 3, '.')}</Text>
                </View>
              ) : (
                <Text style={styles.table.row(2, 0, 0, 1, 1, {paddingVertical: 2, textAlign: 'center'})}>{invoice.totalPrice}</Text>
              )}
              <Text style={styles.table.row(2, 0, 0, 0, 2)}> </Text>
            </View>
          )}
          {invoice.isTotalNoteShown && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.table.row(1, 0, 0, 2, 0)}> </Text>
              <Text style={styles.table.row(5, 0, 0, 0, 0)}> </Text>
              <Text style={styles.table.row(2, 0, 0, 0, 0, {paddingVertical: 2})}>{invoice.tableLabels.totalNote}</Text>
              {/^[0-9]+$/.test(invoice.totalNote.trim()) ? (
                <View style={styles.table.row(2, 0, 0, 1, 1, {flexDirection: 'row', justifyContent: 'space-between'})}>
                  <Text style={{paddingVertical: 2, paddingLeft: 2}}>Rp. </Text>
                  <Text style={{paddingVertical: 2, paddingRight: 2}}>{splitString(invoice.totalNote.trim(), 3, '.')}</Text>
                </View>
              ) : (
                <Text style={styles.table.row(2, 0, 0, 1, 1, {paddingVertical: 2, textAlign: 'center'})}>{invoice.totalNote}</Text>
              )}
              <Text style={styles.table.row(2, 0, 0, 0, 2)}> </Text>
            </View>
          )}
          {invoice.isTotalPaidShown && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.table.row(1, 0, 0, 2, 0)}> </Text>
              <Text style={styles.table.row(5, 0, 0, 0, 0)}> </Text>
              <Text style={styles.table.row(2, 0, 0, 0, 0, {paddingVertical: 2})}>{invoice.tableLabels.totalPaid}</Text>
              {/^[0-9]+$/.test(invoice.totalPaid.trim()) ? (
                <View style={styles.table.row(2, 0, 0, 1, 1, {flexDirection: 'row', justifyContent: 'space-between'})}>
                  <Text style={{paddingVertical: 2, paddingLeft: 2}}>Rp. </Text>
                  <Text style={{paddingVertical: 2, paddingRight: 2}}>{splitString(invoice.totalPaid.trim(), 3, '.')}</Text>
                </View>
              ) : (
                <Text style={styles.table.row(2, 0, 0, 1, 1, {paddingVertical: 2, textAlign: 'center'})}>{invoice.totalPaid}</Text>
              )}
              <Text style={styles.table.row(2, 0, 0, 0, 2)}> </Text>
            </View>
          )}
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.table.row(1, 2, 0, 0, 0)}> </Text>
            <Text style={styles.table.row(7, 2, 0, 0, 0, {paddingVertical: 2, textAlign: 'center', fontFamily: 'Helvetica-Bold'})}>{invoice.tableLabels.calculated}</Text>
            <Text style={styles.table.row(2, 2, 0, 0, 0, {paddingVertical: 2, textAlign: 'center', fontFamily: 'Helvetica-Bold', textDecoration: 'underline'})}>Rp. {splitString(invoice.calculated, 3, '.')}</Text>
            <Text style={styles.table.row(2, 2, 0, 0, 0)}> </Text>
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
