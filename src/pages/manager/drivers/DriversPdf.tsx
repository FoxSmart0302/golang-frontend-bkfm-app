
import CarImg from '../../../assets/truck_example.jpg';
import {Page, Text, Document, StyleSheet, PDFViewer, View, Image} from '@react-pdf/renderer';
import { getFormattedDate} from '../../../components/utils';
import useDrivers from '../../../api/drivers';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    // margin: 12,
    // marginBottom:1,
    fontSize: 15,
    textAlign: "justify",
    fon1Family: "Times-Roman",
  },
  image: {
    left: 0,
    top: 0,
    width: 250,
    padding: 40,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  horizontalline: {
    width: "auto",
    height: 1,
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
  },
  container: {
    flexDirection: "row",
  },
  table: {
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: "35px",
    flex: 1,
    width: "100%",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  smtableHeader: {
    width: "5%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableHeader: {
    width: "45%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  smtableContainer: {
    width: "5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  tableContainer: {
    width: "45%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeaderCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 15,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
  },
  tableCellParticipant: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
  },
});

type Props = {
  driver: {
    name: string;
    birth_name: string;
    birth_date: string;
    module95: string;
    birth_place: string;
    doctor_type: string;
    gender: string;
    email: string;
    school_company_id: string;
    user_id: string;
    driving_license: "C1" | "C1E" | "C" | "CE" | "D1" | "D1E" | "D" | "DE";
    school_company_name: string;
  };
  company: {
    id: string;
    name: string;
  };
};

type Driver = {
  id: number;
  name: string;
  age: number;
};

const DriversPdf = (props: Props) => {
    const drivers = useDrivers("created_at");
    console.log("pdfmodule95:", drivers);
    const tempList:Driver[] = drivers.data;
    if (!tempList) return <div>Loading...</div>;
    return (
      <PDFViewer height="100%" width="100%">
        <Document title="BKF Kurs">
          <Page size="A4" orientation="landscape" style={styles.body}>
            <Text style={styles.title} fixed>
              {props.company.name}
            </Text>
            <View style={styles.textContainer}>
              <View style={styles.imageContainer}>
                <Image style={styles.image} src={CarImg} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.text} fixed>
                  Vollständigername: {props.driver.name}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Geburtsname: {props.driver.birth_name}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Geburtsort: {props.driver.birth_place}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Geburtsdatum:{getFormattedDate(props.driver.birth_date)}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Doktorgrad: {props.driver.doctor_type}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Geschlecht: {props.driver.gender}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Email: {props.driver.email}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Führerschein:{getFormattedDate(props.driver.module95)}
                </Text>
                <View style={styles.horizontalline} />
                <Text style={styles.text} fixed>
                  Führerscheinklasssen: {props.driver.driving_license}
                </Text>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.smtableHeader}>
                    <Text style={styles.tableHeaderCell}>#</Text>
                  </View>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>
                      Abgeschlossene Module
                    </Text>
                  </View>
                </View>
                {tempList &&
                  tempList.map((driver, index) => (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.smtableContainer}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                      </View>
                      <View style={styles.tableContainer}>
                        <Text style={styles.tableCell}>{driver.name}</Text>
                      </View>
                    </View>
                  ))}
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.smtableHeader}>
                    <Text style={styles.tableHeaderCell}>#</Text>
                  </View>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Geplante Module</Text>
                  </View>
                </View>
                {tempList &&
                  tempList.map((driver, index) => (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.smtableContainer}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                      </View>
                      <View style={styles.tableContainer}>
                        <Text style={styles.tableCell}>{driver.name} </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
}

export default DriversPdf;