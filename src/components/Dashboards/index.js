import React, { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as cicloAction from "../../actions/ciclo.actions";
import PremiumModal from "./Modals/PremiumModal";
import ClassicModal from "./Modals/ClassicModal";
import firebase from "../../utils/firebase";
import { getCiclo } from "../../services/vimeo";

function Dashboard({ setCicloData, auth, comprar }) {
  const [materials, setMaterials] = useState(false);
  const [isShowNotPremiumModal, setIsShowNotPremiumModal] = useState(false);
  const [isShowMaterials, setIsShowMaterials] = useState(false);
  const aplicar = () => {
    window.location.replace(
      "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=520976081-aa7b5bf9-7bd9-4596-943d-ab61df889588"
    );
  };
  useEffect(() => {
    async function getMaterial() {
      const db = await firebase.app().storage();
      let items = [];
      const res = await db.ref(`/LinkZoom`).listAll();
      if (res.items && res.items.length > 0) {
        res.items.map(async (el, ind) => {
          let obj = {
            name: "https://zoom.us/j/" + el.name.substring(0, 10),
            url: el.fullPath,
            download: await el.getDownloadURL(),
            type: el.getMetadata(),
          };
          items.push(obj);
        });
      }
      console.log("debuggin: ", res);
      console.log("materials: ", items);
      return setMaterials(items);
    }
    getMaterial();
  }, []);
  useEffect(() => {
    async function getC() {
      await getCiclo().then((res) => {
        console.log("response ciclo: ", res);
        setCicloData(res);
      });
    }
    getC();
  }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      <div>
        {isShowMaterials
          ? PremiumModal({ setIsShowMaterials, materials })
          : null}
        {isShowNotPremiumModal
          ? ClassicModal({
              setIsShowNotPremiumModal,
              materials,
            })
          : null}
        <img
          id="login"
          className="h-100 w-100 p-0"
          src="/assets/img/perfil.png"
          alt="login"
        />
      </div>
      <div className="container">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-md-10 col-12 perfilh1" align="center">
            <h1 style={{ textTransform: "capitalize" }}>
              {" "}
              ¡Bienvenido {auth.user.name.split(" ")[0]}!
              <img
                className="padding-mobile"
                src="assets/icons/ovni.png"
                width="40"
                style={{ marginTop: -10, marginLeft: 20 }}
                alt=""
              />
            </h1>
            <div />
          </div>
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-md-6 col-sm-8 col-12 text-center ">
            <div style={{ width: "100%" }} className="text-center">
              <img
                src={auth.user.photo}
                width="150"
                alt={auth.user.name}
                className="my-4"
              />
            </div>
            <h5>
              <strong style={{ textTransform: "uppercase" }}>User ID: </strong>
              <br />
              {auth.user.userId ? (
                <span
                  style={{
                    color: "orange",
                    fontSize: "1.6rem",
                    textTransform: "uppercase",
                  }}
                >
                  {auth.user.userId}{" "}
                  {auth.user.isPremium ? "- PREMIUM" : "- CLASSIC"}
                </span>
              ) : (
                <span style={{ color: "orange", fontSize: "1.6rem" }}>-</span>
              )}
            </h5>
            <h5>
              <strong style={{ textTransform: "uppercase" }}>E-mail: </strong>
              <br />
              {auth.user.email
                ? auth.user.email.split("@")[0].slice(0, 4) +
                  "...@" +
                  auth.user.email.split("@")[1]
                : "-"}
            </h5>
            <h5 style={{ textTransform: "capitalize" }}>
              <strong style={{ textTransform: "uppercase" }}>Nombre: </strong>
              <br />
              {auth.user.name}
            </h5>
            <h5>
              <strong style={{ textTransform: "uppercase" }}>Ciclo:</strong>
              <br /> Pre Ulima 2020
            </h5>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
            className="col-md-6 col-sm-4 col-12 perfilR"
            align="right"
          >
            <Link
              to="/rep"
              className="w-75 btn btn-dark btn-lg text-white mx-auto my-4  shadow-lg"
            >
              Ver Clases
            </Link>
            <a
              className="w-75 btn btn-success btn-lg text-white mx-auto my-4  shadow-lg"
              onClick={() =>
                auth.user.isPremium
                  ? setIsShowMaterials(true)
                  : setIsShowNotPremiumModal(true)
              }
            >
              Clases Online
            </a>{" "}
            <h4>Comprar:</h4>
            {comprar && auth.user.isPremium === false ? (
              <Link
                style={{ background: "#EF4F00" }}
                to="/pago"
                className="w-75 btn btn-lg text-white mx-auto my-4  shadow-lg"
              >
                Ulima
              </Link>
            ) : null}
            <btn
              style={{ background: "red" }}
              onClick={() => aplicar()}
              className="w-75 btn btn-lg text-white  mx-auto my-4  shadow-lg"
            >
              San Marcos
            </btn>
          </div>
        </div>

        <div
          className="row"
          style={{ justifyContent: "center", marginTop: 120 }}
        >
          {auth.user.isPremium ? (
            <button className="pagolink btn btn-link">Boleta de Pago</button>
          ) : null}
        </div>
      </div>
      <div className="col-md-12 m-auto  text-center p-2" align="center">
        <br />
        <img src="/assets/icons/footer.png" className="img-fluid" alt="cello" />
      </div>
      <Footer sectionR={false} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch, props) => ({
  setCicloData: (data) => dispatch(cicloAction.setCiclo(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);