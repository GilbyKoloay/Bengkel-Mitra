import {
  StyleSheet,
  Document,
  Page,
  View,
  Text
} from '@react-pdf/renderer';

import { toProperDateTime, splitString } from '../../functions';



const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    gap: 16
  },

  info: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  table: {
    border: '2px solid black',

    row: row => ({
      flexDirection: 'row',
      borderTopWidth: ((row !== 'title') && (row !== 'data-first')) ? 1 : 0,
      borderBottomWidth: (row === 'title') ? 1 : 0,
      borderColor: 'black',
      borderStyle: (row === 'data') ? 'dashed' : 'solid'
    }),
    subRow: {
      width: '91.666667%',
    },
    col: col => ({
      width:
        (col === 'no') ? '8.333333%' :
        (col === 'service') ? '50%' :
        (col === 'price') ? '25%' :
        (col === 'note') ? '25%' : 0,
      padding: 2,
      borderLeftWidth: ((col === 'service') || (col === 'price')) ? 1 : 0,
      borderRightWidth: (col === 'price') ? 1 : 0,
      borderColor: 'black'
    })
  }
});



export default function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View>
          <Text style={{fontSize: 20}}>Mitra Oto</Text>
          <Text>Jl. Pingkan Matindas No. 48, Dendengan Dalam</Text>
          <Text style={{fontSize: 8}}>No. HP: 081356071990</Text>
        </View>



        <View style={{border: '1px solid black', marginVertical: -8}} />



        <View style={styles.info}>
          <View>
            {[
              'Nama Pelanggan',
              'Jenis Kendaraan',
              'Nomor Polisi',
              'Tanggal Masuk',
              'Tanggal Keluar',
              'Kilometer'
            ].map((key, index) => <Text key={index} style={{}}>{key}</Text>)}
          </View>
          <View>
            {[
              invoice.customerName,
              invoice.vehicleType,
              invoice.vehiclePlate,
              invoice.entryDate ? toProperDateTime(invoice.entryDate, true) : '',
              invoice.outDate ? toProperDateTime(invoice.outDate, true) : '',
              invoice.kilometer
            ].map((value, index) => <Text key={index} style={{}}>: {value ? value : '-'}</Text>)}
          </View>
        </View>



        <View style={styles.table}>
          <View style={[styles.table.row('title'), {fontSize: 14}]}>
            <Text style={[styles.table.col('no'), {textAlign: 'center'}]}>No</Text>
            <View style={[styles.table.subRow, {flexDirection: 'row'}]}>
              <Text style={[styles.table.col('service'), {textAlign: 'center'}]}>Uraian Pekerjaan</Text>
              <Text style={[styles.table.col('price'), {textAlign: 'center'}]}>Harga</Text>
              <Text style={[styles.table.col('note'), {textAlign: 'center'}]}>Keterangan</Text>
            </View>
          </View>
          {invoice.services.map((subServices, index) => (
            <View key={index} style={styles.table.row(index ? 'data' : 'data-first')}>
              <Text style={[styles.table.col('no'), {textAlign: 'center'}]}>{index+1}</Text>
              <View style={styles.table.subRow}>
                {subServices.map((subService, subIndex) => (
                  <View key={subIndex} style={{flexDirection: 'row'}}>
                    <View style={styles.table.col('service')}>
                      <Text>{subService.name}</Text>
                      {subService.paid && <Text style={{textAlign: 'right'}}>Panjar</Text>}
                    </View>
                    <View style={[styles.table.col('price'), {justifyContent: 'space-between'}]}>
                      {subService.price ? (
                        <Text style={{textAlign: 'right'}}>Rp. {splitString(subService.price, 3, '.')}</Text>
                      ) : (
                        <Text style={{textAlign: 'center'}}>-</Text>
                      )}
                      {subService.paid && <Text style={{textAlign: 'right'}}>Rp. {splitString(subService.paid, 3, '.')}</Text>}
                    </View>
                    <Text style={styles.table.col('note')}>{subService.note}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <View style={[styles.table.row('total'), {fontSize: 14}]}>
            <View style={[styles.table.col('no')]} />
            <View style={[styles.table.subRow, {flexDirection: 'row'}]}>
              <Text style={[styles.table.col('service'), {textAlign: 'center'}]}>Jumlah</Text>
              <Text style={[styles.table.col('price'), {textAlign: 'right'}]}>Rp. {splitString(invoice.totalPrice, 3, '.')}</Text>
              <View style={[styles.table.col('note')]} />
            </View>
          </View>
        </View>



        <View style={{gap: 8}}>
          <View>
            <Text>*catatan:</Text>
            {invoice.notes.map((note, index) => (
              <Text key={index} style={{marginLeft: 4}}>- {note}</Text>
            ))}
          </View>
          <View>
            <Text style={{textAlign: 'right'}}>{invoice.city} - {toProperDateTime(invoice.createDate, true)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
