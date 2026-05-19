import {useEffect, useState} from "react";
import {fetchServices, IService, updateService} from "../../api/services.ts";

export default function AdminServicesPage() {
  // Leistungen verwalten: Erstellen, Bearbeiten, Loeschen
    const [serviceSearch, setServiceSearch] = useState("");
    const [services, setServices] = useState<IService[]>([])
    const [selectedServiceForEditing, setSelectedServiceForEditing] = useState<IService>()

    const [title, setTitle] = useState("")
    const [icon, setIcon] = useState("")
    const [description, setDescription] = useState("")

    const handleEditSubmit = async () => {
        if (!selectedServiceForEditing || selectedServiceForEditing.id === undefined) {
            console.error("Service ohne ID kann nicht geupdated werden");
            return;
        }

        const updatedService: Omit<IService, "id"> = {
            icon,
            title,
            subtitle: description,
            sort: 0
        };

        await updateService(selectedServiceForEditing.id, updatedService);

        setSelectedServiceForEditing(undefined);
        setIcon("");
        setTitle("");
        setDescription("");
    }

    const onCancel = () => {
        setSelectedServiceForEditing(undefined);
        setIcon("");
        setTitle("");
        setDescription("");
    }

    const updateSearch = (text : string) => {
        setServiceSearch(text);
    }

    useEffect(() => {
        const getServices = async () => {
            const serviceData = await fetchServices();

            setServices(serviceData);
        }

        getServices();
    }, []);

  return <>
      <div>
          <div>
              <input placeholder={"Leistungen suchen..."} onChange={e => {
                  updateSearch(e.target.value);
              }}/>

              <button>+Neue Leistungen</button>
          </div>

          <div>
              {selectedServiceForEditing ? (
                  <table>
                      <tr>
                          <th>Id</th>
                          <th>Icon</th>
                          <th>Titel</th>
                          <th>Untertitel</th>
                          <th>Aktionen</th>
                      </tr>

                      {services.slice(0, 4).map(value => {
                          return <tr>
                              <td>{value.id}</td>
                              <td>{value.icon}</td>
                              <td>{value.title}</td>
                              <td>{value.subtitle}</td>
                              <td>
                                  <button onClick={e =>
                                  {setSelectedServiceForEditing(value)}}>
                                      Bearbeiten</button>
                              </td>
                          </tr>
                      })}
                  </table>
              ): (
                  <table>
                      <tr>
                          <th>Id</th>
                          <th>Icon</th>
                          <th>Titel</th>
                          <th>Untertitel</th>
                          <th>Aktionen</th>
                      </tr>

                      {services.map(value => {
                          return <tr>
                              <td>{value.id}</td>
                              <td>{value.icon}</td>
                              <td>{value.title}</td>
                              <td>{value.subtitle}</td>
                              <td>
                                  <button onClick={e =>
                                  {setSelectedServiceForEditing(value)}}>
                                      Bearbeiten</button>
                              </td>
                          </tr>
                      })}
                  </table>
              )}

              {selectedServiceForEditing && (
                  <form onSubmit={handleEditSubmit}>
                      <h2>Service Bearbeiten</h2>

                      <div>
                          <label htmlFor={"title"}>Titel</label>
                          <input
                              id={"title"}
                              placeholder={"Titel"}
                              type={"text"}
                              value={title}
                              required={true}
                              onChange={e => {setTitle(e.target.value)}}
                          />
                          <label htmlFor={"Icon"}>Icon</label>
                          <input
                              id={"Icon"}
                              placeholder={"Icon"}
                              type={"text"}
                              value={icon}
                              required={true}
                              onChange={e => {setIcon(e.target.value)}}
                          />
                      </div>

                      <label htmlFor={"description"}>Untertitel</label>
                      <input
                          id={"description"}
                          placeholder={"Untertitel"}
                          type={"text"}
                          value={description}
                          required={true}
                          onChange={e => {setDescription(e.target.value)}}
                      />

                      <div>
                          <button onClick={onCancel}>Abbrechen</button>
                          <button type="submit">Speichern</button>
                      </div>
                  </form>
              )}
          </div>
      </div>
  </>;
}
