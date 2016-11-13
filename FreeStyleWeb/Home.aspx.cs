using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FreeStyleWeb
{
    public struct Rhyme
    {
        public string Word;
        public int Frequency;
        public int Syllables;
    }

    public partial class Home : System.Web.UI.Page
    {
        WebClient client;
        Rhyme[] rhymes;

        protected void Page_Load(object sender, EventArgs e)
        {
            client = new WebClient();
            rhymes = new Rhyme[2];
        }

        protected void fireButton_Click(object sender, EventArgs e)
        {
            string[] rhyme = new string[2];

            for (int i = 0; i < rhyme.Length; i++)
            {
                string recievedSentence = getSentence(client);
                string[] temp = splitSentence(recievedSentence.Remove(recievedSentence.Length - 1));

                if (i % 2 == 0)
                {
                    displayChar('-', 10);

                    rhymes = getRhymes(client.DownloadString(string.Format("http://rhymebrain.com/talk?function=getRhymes&word={0}", temp[temp.Length - 1])));
                }
                else
                {
                    int whichRhyme = 0;
                    do
                    {
                        temp[temp.Length - 1] = rhymes[whichRhyme].Word + ".";
                        whichRhyme++;
                    }
                    while (temp[temp.Length - 1] == splitSentence(rhyme[i - 1])[splitSentence(rhyme[i - 1]).Length - 1]);
                }

                rhyme[i] = combineSentence(temp);

                Label1.Text += rhyme[i] + "\n";
            }
        }

        Rhyme[] getRhymes(string word)
        {
            return JsonConvert.DeserializeObject<Rhyme[]>(word);
        }

        string getSentence(WebClient client)
        {
            return Encoding.UTF8.GetString(client.UploadValues("http://kylestetz.com/sentencer", new System.Collections.Specialized.NameValueCollection()
            {
                {"template", "{{ adjective }} {{ noun }}." }
            }));
        }

        string[] splitSentence(string sentence)
        {
            return sentence.Split(new char[] { ' ' }, 4, StringSplitOptions.None);
        }

        string combineSentence(string[] sentence)
        {
            string temp = "";

            for (int i = 0; i < sentence.Length; i++)
            {
                temp += sentence[i] + " ";
            }

            return temp;
        }

        void displayChar(char character, int amount)
        {
            for (int i = 0; i < amount; i++)
            {
                Console.Write(character);
            }

            Console.WriteLine();
        }
    }
}